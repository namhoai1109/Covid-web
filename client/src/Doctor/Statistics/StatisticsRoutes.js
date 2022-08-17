import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Statistics.module.scss';
import { NavStatistic } from '../staticVar';
import { statisticsRoutes } from '~/routes';
import configs from '~/config';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

function StatisticsRoutes() {
    let location = useLocation();
    let [curPath, setCurPath] = useState();

    useEffect(() => {
        setCurPath(location.pathname);
    }, [location.pathname]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('nav-list', 'flex-center')}>
                {NavStatistic.map((nav, index) => {
                    return (
                        <Link
                            key={index}
                            className={cx('nav-item', {
                                active: curPath === nav.path,
                            })}
                            to={nav.path}
                        >
                            {nav.name}
                        </Link>
                    );
                })}
            </div>
            <div className={cx('wrap-chart', 'flex-center')}>
                <Routes>
                    {statisticsRoutes.map((route, index) => {
                        let Page = route.element;
                        return <Route key={index} path={route.path} element={<Page />} />;
                    })}
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={
                                    configs.mainRoutes.doctor +
                                    configs.doctorRoutes.statistics +
                                    configs.statisticsRoutes.covidPatient
                                }
                                replace
                            />
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}

export default StatisticsRoutes;
