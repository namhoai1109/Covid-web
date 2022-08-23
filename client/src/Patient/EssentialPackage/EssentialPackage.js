import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import WrapContent from '~/CommonComponent/WrapContent';
import Package from '~/CommonComponent/Package';
import classNames from 'classnames/bind';
import styles from './EssentialPackage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPackage } from '../redux/currentPackage';
import { useNavigate } from 'react-router-dom';
import configs from '~/config';
import StateWidget from '~/CommonComponent/StateWidget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { resetState } from '~/Doctor/redux/filterState';
import { searchAPI } from '~/APIservices/searchAPI';
import { filterAPI } from '~/APIservices/filterAPI';
import { sortAPI } from '~/APIservices/sortAPI';

const cx = classNames.bind(styles);

function EssentialPackage() {
    let [listPackage, setListPackage] = useState([]);
    let dispatch = useDispatch();
    let navigate = useNavigate();

    let filterState = useSelector((state) => state.filterState.filter);
    let valueFilter = useSelector((state) => state.filterState.valueFilter);
    let searchValue = useSelector((state) => state.filterState.search);
    let sortParam = useSelector((state) => state.filterState.sort);

    // console.log(searchValue);

    let getListPackage = useCallback(async () => {
        let list = await getAPI('patient/packages');
        if (list.length > 0) setListPackage(list);
    }, []);

    let navInfoPackage = useCallback((item) => {
        dispatch(setCurrentPackage(item));
        navigate(
            configs.mainRoutes.patient + configs.patientRoutes.essentialPackage + configs.patientRoutes.infoPackage,
        );
    }, []);

    let getListSearch = useCallback(async (value) => {
        let list = await searchAPI('patient/packages/search', value);
        if (Array.isArray(list)) {
            setListPackage(list);
        }
    }, []);

    let getListFilter = useCallback(async () => {
        let nFilterState = filterState[filterState.length - 1];
        let tmp = {
            [nFilterState]: valueFilter[nFilterState],
        };
        if (tmp[nFilterState] !== '') {
            let res = await filterAPI('patient/packages/filter', tmp);
            setListPackage(res);
        }
    }, [filterState, valueFilter]);

    let getListSort = useCallback(async () => {
        let res = await sortAPI('patient/packages', sortParam);
        setListPackage(res);
    }, [sortParam]);

    useEffect(() => {
        getListPackage();
    }, []);

    useEffect(() => {
        if (filterState.length !== 0) {
            getListFilter();
        }

        if (searchValue !== '') {
            getListSearch(searchValue);
        }

        if (sortParam.sort_by) {
            getListSort(sortParam);
        }

        if (filterState.length === 0 && searchValue === '' && !sortParam.sort_by) {
            getListPackage();
        }
    }, [valueFilter, filterState, searchValue, sortParam]);

    let handleDeleteState = useCallback(() => {
        dispatch(resetState());
    }, []);

    return (
        <div className={cx('wrapper')}>
            {filterState.length !== 0 && (
                <StateWidget
                    title={'filtering'}
                    icon={<FontAwesomeIcon icon={faFilterCircleXmark} />}
                    onClick={handleDeleteState}
                />
            )}
            {sortParam.sort_by && (
                <StateWidget
                    title={'sorting'}
                    icon={<FontAwesomeIcon icon={faArrowDownWideShort} />}
                    onClick={handleDeleteState}
                />
            )}
            <WrapContent>
                <div className={cx('row', 'packages')}>
                    {listPackage.map((item, index) => {
                        return (
                            <div key={index} className={cx('col2', 'package')}>
                                <Package infos={item} onClick={() => navInfoPackage(item)} />
                            </div>
                        );
                    })}
                </div>
            </WrapContent>
        </div>
    );
}

export default EssentialPackage;
