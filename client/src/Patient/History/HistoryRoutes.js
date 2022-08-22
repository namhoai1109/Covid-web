import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import configs from '~/config';
import HistoryManagement from './HistoryManagement';
import classNames from 'classnames/bind';
import styles from './History.module.scss';
import HistoryPayment from './HistoryPayment';
import { useEffect, useState } from 'react';
import HistoryConsumption from './HistoryConsumption';
const cx = classNames.bind(styles);

let pathHistoryManagement =
    configs.mainRoutes.patient + configs.patientRoutes.history + configs.patientRoutes.managementHistory;

let pathHistoryPayment =
    configs.mainRoutes.patient + configs.patientRoutes.history + configs.patientRoutes.paymentHistory;

let pathHistoryConsumption =
    configs.mainRoutes.patient + configs.patientRoutes.history + configs.patientRoutes.consumptionHistory;

function HistoryRoutes() {
    let location = useLocation();
    let [curPath, setCurPath] = useState();

    useEffect(() => {
        setCurPath(location.pathname);
    }, [location.pathname]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('nav-list', 'flex-center')}>
                <Link
                    className={cx('nav-item', {
                        active: curPath === pathHistoryManagement,
                    })}
                    to={pathHistoryManagement}
                >
                    Management
                </Link>
                <Link
                    className={cx('nav-item', {
                        active: curPath === pathHistoryPayment,
                    })}
                    to={pathHistoryPayment}
                >
                    Payment
                </Link>
                <Link
                    className={cx('nav-item', {
                        active: curPath === pathHistoryConsumption,
                    })}
                    to={pathHistoryConsumption}
                >
                    Consumption
                </Link>
            </div>
            <div className={cx('wrap-content', 'flex-center')}>
                <Routes>
                    <Route path={configs.patientRoutes.managementHistory} element={<HistoryManagement />} />
                    <Route path={configs.patientRoutes.paymentHistory} element={<HistoryPayment />} />
                    <Route path={configs.patientRoutes.consumptionHistory} element={<HistoryConsumption />} />
                    <Route path="/" element={<Navigate to={pathHistoryManagement} replace />} />
                </Routes>
            </div>
        </div>
    );
}

export default HistoryRoutes;
