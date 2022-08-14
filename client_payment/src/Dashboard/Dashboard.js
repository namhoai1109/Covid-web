import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/postAPI';
import styles from './Dashboard.module.scss';

const cx = classNames.bind(styles);

function Dashboard() {
    let [infos, setInfos] = useState({
        username: '',
        balance: '',
    });

    let getInfo = useCallback(async () => {
        let id = JSON.parse(localStorage.getItem('ID'));
        let res = await getAPI('/main/info/id=' + id);
        setInfos({
            username: res.username,
            balance: res.balance,
        });
    });

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <div className={cx('fit-screen', 'flex-center')}>
            <div className={cx('container')}>
                <div className={cx('flex-center')}>
                    <span>ID:</span>
                    <span>{infos.username}</span>
                </div>
                <div className={cx('flex-center')}>
                    <span>Balance:</span>
                    <span>{infos.balance} VND</span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
