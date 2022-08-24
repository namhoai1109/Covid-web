import classNames from 'classnames/bind';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './EssentialPackage.module.scss';
import Package from '~/CommonComponent/Package';
import { useDispatch, useSelector } from 'react-redux';
import { getAPI } from '~/APIservices/getAPI';
import { useCallback, useEffect, useState } from 'react';
import { deleteAPI } from '~/APIservices/deleteAPI';
import { useNavigate } from 'react-router-dom';
import configs from '~/config';
import { setCurrentPackage } from '../redux/currentPackage';
import { searchAPI } from '~/APIservices/searchAPI';
import { filterAPI } from '~/APIservices/filterAPI';
import StateWidget from '~/CommonComponent/StateWidget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { resetState } from '../redux/filterState';
import { sortAPI } from '~/APIservices/sortAPI';
import { setMess } from '../redux/messNoti';
const cx = classNames.bind(styles);

function EssentialPackage() {
    let navigate = useNavigate();
    let deleteState = useSelector((state) => state.deleteState.state);
    let filterState = useSelector((state) => state.filterState.filter);
    let valueFilter = useSelector((state) => state.filterState.valueFilter);
    let searchValue = useSelector((state) => state.filterState.search);
    let sortParam = useSelector((state) => state.filterState.sort);

    let [listPackage, setListPackage] = useState([]);
    let dispatch = useDispatch();

    let getListPackage = useCallback(async () => {
        let list = await getAPI('doctor/packages');
        //console.log(list);
        if (Array.isArray(list)) {
            //dispatch(setListPackage(list));
            setListPackage(list);
        }
    }, []);

    let getListSearch = useCallback(async (value) => {
        let list = await searchAPI('doctor/packages/search', value);
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
            console.log(tmp);
            let res = await filterAPI('doctor/packages/filter', tmp);
            setListPackage(res);
        }
    }, [filterState, valueFilter]);

    let getListSort = useCallback(async () => {
        let res = await sortAPI('doctor/packages', sortParam);
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

    let handleDeletePackage = useCallback(async (id) => {
        let res = await deleteAPI('doctor/packages/id=' + id);
        getListPackage();
        dispatch(setMess({ mess: 'Delete successfully', type: 'success' }));
    }, []);

    let navInfoPackage = useCallback((pack) => {
        dispatch(setCurrentPackage(pack));
        navigate(configs.mainRoutes.doctor + configs.doctorRoutes.essentialPackage + configs.doctorRoutes.infoPackage);
    }, []);

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
                                <Package
                                    infos={item}
                                    deleteState={deleteState}
                                    clickDelete={() => handleDeletePackage(item._id)}
                                    onClick={() => navInfoPackage(item)}
                                />
                            </div>
                        );
                    })}
                </div>
            </WrapContent>
        </div>
    );
}

export default EssentialPackage;
