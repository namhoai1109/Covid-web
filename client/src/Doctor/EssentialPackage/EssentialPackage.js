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
const cx = classNames.bind(styles);

function EssentialPackage() {
    let navigate = useNavigate();
    let deleteState = useSelector((state) => state.deleteState.state);
    let [listPackage, setListPackage] = useState([]);
    let dispatch = useDispatch();
    // let listPackage = useSelector((state) => state.listPackage.list);

    let getListPackage = async () => {
        let list = await getAPI('doctor/packages');
        //console.log(list);
        if (Array.isArray(list)) {
            //dispatch(setListPackage(list));
            setListPackage(list);
        }
    };

    useEffect(() => {
        getListPackage();
    }, []);

    let handleDeletePackage = useCallback(async (id) => {
        let res = await deleteAPI('doctor/packages/id=' + id);
        getListPackage();
    });

    let navInfoPackage = useCallback((pack) => {
        dispatch(setCurrentPackage(pack));
        navigate(configs.mainRoutes.doctor + configs.doctorRoutes.essentialPackage + configs.doctorRoutes.infoPackage);
    });

    return (
        <div className={cx('wrapper')}>
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
