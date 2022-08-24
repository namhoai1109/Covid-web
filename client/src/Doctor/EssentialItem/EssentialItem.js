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
import StateWidget from '~/CommonComponent/StateWidget';
import { setMess } from '../redux/messNoti';

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

    let getListFilter = useCallback(async () => {
        let nFilterState = filterState[filterState.length - 1];
        let tmp = {
            [nFilterState]: valueFilter[nFilterState],
        };
        if (tmp[nFilterState] !== '') {
            let res = await filterAPI('doctor/products/filter', tmp);
            setListProduct(res);
        }
    }, [filterState, valueFilter]);

    let getListSearch = useCallback(async (value) => {
        let res = await searchAPI('doctor/products/search', value);
        setListProduct(res);
    }, []);

    let getListSort = useCallback(async () => {
        let res = await sortAPI('doctor/products', sortParam);
        setListProduct(res);
    }, [sortParam]);

    let fetchListProduct = useCallback(async () => {
        let list = await getAPI('/doctor/products');
        //console.log(list);
        setListProduct(list);
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
        if (res.message && res.message === 'Product deleted successfully') {
            fetchListProduct();
            dispatch(setMess({ mess: 'Delete successully', type: 'success' }));
        } else if (
            res.response &&
            res.response.data.message === 'Cannot delete product that is in any package that is at minimum 2 products'
        ) {
            console.log(res.response.data.message);
            dispatch(setMess({ mess: res.response.data.message, type: 'error' }));
        }
    }, []);

    let handleNavPage = useCallback((item) => {
        navigate(configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem + configs.doctorRoutes.infoNecessity);
        dispatch(setCurr(item));
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
