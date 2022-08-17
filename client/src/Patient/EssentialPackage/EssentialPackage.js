import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import WrapContent from '~/CommonComponent/WrapContent';
import Package from '~/CommonComponent/Package';
import classNames from 'classnames/bind';
import styles from './EssentialPackage.module.scss';
import { useDispatch } from 'react-redux';
import { setCurrentPackage } from '../redux/currentPackage';
import { useNavigate } from 'react-router-dom';
import configs from '~/config';

const cx = classNames.bind(styles);

function EssentialPackage() {
    let [listPackage, setListPackage] = useState([]);
    let dispatch = useDispatch();
    let navigate = useNavigate();

    let getListPackage = useCallback(async () => {
        let list = await getAPI('patient/packages');
        setListPackage(list);
    });

    let navInfoPackage = useCallback((item) => {
        dispatch(setCurrentPackage(item));
        navigate(
            configs.mainRoutes.patient + configs.patientRoutes.essentialPackage + configs.patientRoutes.infoPackage,
        );
    });

    useEffect(() => {
        getListPackage();
    }, []);

    return (
        <div className={cx('wrapper')}>
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
