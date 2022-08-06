import { faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Counting from '~/CommonComponent/Counting';
import ListItem from '~/CommonComponent/ListItem';
import WrapContent from '~/CommonComponent/WrapContent';
import configs from '~/config';
import { setCurr } from '../redux/currentNecessity';
import { deleteCurrentPackage } from '../redux/currentPackage';
import { packageFields } from '../staticVar';
import styles from './EssentialPackage.module.scss';

const cx = classNames.bind(styles);

function InfoPackage() {
    let currPackage = useSelector((state) => state.currentPackage.current);
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let [listCounting, setListCounting] = useState({});
    useEffect(() => {
        if (currPackage.products) {
            let tmp = {};
            currPackage.products.forEach((item) => {
                tmp[item.product._id] = 0;
            });
            setListCounting(tmp);
        }
    }, []);

    let formatedProducts = useCallback((product, max_count) => {
        let id = product._id;
        let increasing = () => {
            setListCounting((prev) => ({ ...prev, [id]: prev[id] + 1 }));
        };

        let decreasing = () => {
            setListCounting((prev) => ({ ...prev, [id]: prev[id] - 1 }));
        };

        let handleShowDetails = () => {
            dispatch(setCurr(product));
            navigate(
                configs.mainRoutes.patient + configs.patientRoutes.essentialPackage + configs.patientRoutes.infoProduct,
            );
        };
        let nProduct = {
            name: product.name,
            price: product.price,
            quantity_unit: product.quantity_unit,
            counting: (
                <Counting
                    maxValue={max_count}
                    minValue={0}
                    value={listCounting[id]}
                    increasing={increasing}
                    decreasing={decreasing}
                />
            ),
            details: (
                <button className={cx('details')} onClick={handleShowDetails}>
                    details
                </button>
            ),
        };

        return nProduct;
    });

    return (
        <div className={cx('wrapper')}>
            <WrapContent>
                <button className={cx('submit-btn', 'flex-center')}>
                    <span className={cx('title')}>Pay</span>
                    <FontAwesomeIcon icon={faCashRegister} />
                </button>

                <div className={cx('input-field', 'flex-center')}>
                    <span className={cx('label')}>Name: </span>
                    <span className={cx('title')}>{currPackage.name}</span>
                </div>

                <div>
                    <div className={cx('input-field', 'flex-center')}>
                        <span className={cx('label')}>You can buy maximum</span>
                        <span className={cx('color-primary')}>{currPackage.limit_per_patient}</span>
                        <span className={cx('label', 'ml')}>package(s) in</span>
                        <span className={cx('color-primary')}>{`${
                            (currPackage.time_limit && currPackage.time_limit.value) || ''
                        } ${(currPackage.time_limit && currPackage.time_limit.unit) || ''}`}</span>
                    </div>
                </div>
                <div className={cx('input-field', 'flex-center')}>
                    <span className={cx('label', 'title')}>List products</span>
                </div>

                <div className={cx('list-product')}>
                    <ListItem noUnderLine infos={packageFields} />
                    {Array.isArray(currPackage.products) &&
                        currPackage.products.map((product, index) => {
                            let nProduct = formatedProducts(product.product, product.quantity);
                            return <ListItem key={index} infos={nProduct} />;
                        })}
                </div>
            </WrapContent>
        </div>
    );
}

export default InfoPackage;
