import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAPI } from '~/APIservices/getAPI';
import NecessityItem from '~/CommonComponent/NecessityItem';
import WrapContent from '~/CommonComponent/WrapContent';
import { addProduct } from '../redux/currentListProduct';
import styles from './EssentialPackage.module.scss';

const cx = classNames.bind(styles);

function ListProduct({ onBack }) {
    let dispatch = useDispatch();
    let [listProduct, setListProduct] = useState([]);
    let fetchListProduct = async () => {
        let list = await getAPI('/doctor/products');
        setListProduct(list);
    };

    let handleClickProduct = (item) => {
        dispatch(addProduct(item));
        onBack();
    };

    useEffect(() => {
        fetchListProduct();
    }, []);
    return (
        <WrapContent>
            <div className={cx('row', 'wrap-list')}>
                {listProduct.map((item, index) => {
                    return (
                        <div key={index} className={cx('col2', 'item')}>
                            <NecessityItem infos={item} onClick={() => handleClickProduct(item)} />
                        </div>
                    );
                })}
            </div>
        </WrapContent>
    );
}

export default ListProduct;
