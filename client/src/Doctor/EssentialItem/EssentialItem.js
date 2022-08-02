import classNames from 'classnames/bind';
import styles from './EssentialItem.module.scss';
import WrapContent from '~/CommonComponent/WrapContent';
import NecessityItem from '~/CommonComponent/NecessityItem';
import { getAPI } from '~/APIservices/getAPI';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAPI } from '~/APIservices/deleteAPI';
import { useNavigate } from 'react-router-dom';
import { setCurr } from '../redux/currentNecessity';
import configs from '~/config';
import { searchAPI } from '~/APIservices/searchAPI';
import { filterAPI } from '~/APIservices/filterAPI';
import { resetState } from '../redux/filterState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort, faFilterCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { sortAPI } from '~/APIservices/sortAPI';

const cx = classNames.bind(styles);

function EssentialItem() {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let [listProduct, setListProduct] = useState([]);
    let deleteState = useSelector((state) => state.deleteState.state);
    let filterState = useSelector((state) => state.filterState.filter);
    let valueFilter = useSelector((state) => state.filterState.valueFilter);
    let searchValue = useSelector((state) => state.filterState.search);
    let sortParam = useSelector((state) => state.filterState.sort);

    let getListSearch = useCallback(async (value) => {
        let res = await searchAPI('doctor/products/search', value);
        setListProduct(res);
    });

    let getListFilter = useCallback(async () => {
        let nFilterState = filterState[filterState.length - 1];
        let tmp = {
            [nFilterState]: valueFilter[nFilterState],
        };
        if (tmp[nFilterState] !== '') {
            let res = await filterAPI('doctor/products/filter', tmp);
            setListProduct(res);
        }
    });

    let getListSort = useCallback(async () => {
        let res = await sortAPI('doctor/products', sortParam);
        setListProduct(res);
    });

    let fetchListProduct = useCallback(async () => {
        let list = await getAPI('/doctor/products');
        //console.log(list);
        setListProduct(list);
    });

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
            fetchListProduct();
        }
    }, [valueFilter, filterState, searchValue, sortParam]);

    useEffect(() => {
        fetchListProduct();

        return () => {
            //reset state filter redux
            dispatch(resetState());
        };
    }, []);

    let handleDelete = useCallback(async (id) => {
        let res = await deleteAPI('doctor/products/id=' + id);
        console.log(res);
        fetchListProduct();
    });

    let handleNavPage = useCallback((item) => {
        navigate(configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem + configs.doctorRoutes.infoNecessity);
        dispatch(setCurr(item));
    });

    let handleDeleteState = useCallback(() => {
        dispatch(resetState());
    });

    return (
        <div className={cx('wrapper')}>
            {filterState.length !== 0 && (
                <div className={cx('filter-state', 'flex-center')}>
                    <span>filtering</span>
                    <span>
                        <FontAwesomeIcon icon={faFilterCircleXmark} />
                    </span>
                    <span onClick={handleDeleteState} className={cx('delete-state', 'flex-center')}>
                        <FontAwesomeIcon icon={faXmark} />
                    </span>
                </div>
            )}
            {sortParam.sort_by && (
                <div className={cx('filter-state', 'flex-center')}>
                    <span>sorting</span>
                    <span>
                        <FontAwesomeIcon icon={faArrowDownWideShort} />
                    </span>
                    <span onClick={handleDeleteState} className={cx('delete-state', 'flex-center')}>
                        <FontAwesomeIcon icon={faXmark} />
                    </span>
                </div>
            )}
            <WrapContent>
                <div className={cx('row', 'wrap-list')}>
                    {listProduct.map((item, index) => {
                        return (
                            <div key={index} className={cx('col2', 'item')}>
                                <NecessityItem
                                    showDelete={deleteState}
                                    infos={item}
                                    clickDelete={() => handleDelete(item._id)}
                                    onClick={() => handleNavPage(item)}
                                />
                            </div>
                        );
                    })}
                </div>
            </WrapContent>
        </div>
    );
}

export default EssentialItem;
