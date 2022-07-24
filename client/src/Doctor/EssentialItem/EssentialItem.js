import classNames from 'classnames/bind';
import styles from './EssentialItem.module.scss';
import WrapContent from '~/CommonComponent/WrapContent';
import NecessityItem from '~/CommonComponent/NecessityItem';
import { getAPI } from '~/APIservices/getAPI';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAPI } from '~/APIservices/deleteAPI';
import { useNavigate } from 'react-router-dom';
import { setCurr } from '../redux/currentNecessity';
import configs from '~/config';

const cx = classNames.bind(styles);

function EssentialItem() {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let [listProduct, setListProduct] = useState([]);
    let deleteState = useSelector((state) => state.deleteState.state);
    let fetchListProduct = async () => {
        let list = await getAPI('/doctor/products');
        //console.log(list);
        setListProduct(list);
    };

    useEffect(() => {
        fetchListProduct();
    }, []);

    let handleDelete = async (id) => {
        let res = await deleteAPI('doctor/products/id=' + id);
        console.log(res);
        fetchListProduct();
    };

    let handleNavPage = (item) => {
        navigate(configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem + configs.doctorRoutes.infoNecessity);
        dispatch(setCurr(item));
    };

    return (
        <div className={cx('wrapper')}>
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
