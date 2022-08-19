import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import styles from './History.module.scss';
const cx = classNames.bind(styles);

function HistoryManagement() {
    let [Logs, setLogs] = useState([]);

    let getLogs = useCallback(async () => {
        let res = await getAPI('patient/logs');
        if (res.length > 0) {
            let tmp = res.map((item) => {
                return {
                    action: item.action,
                    description: item.description.replaceAll('\n', ' | '),
                    time: item.time.split('T')[0],
                };
            });
            console.log(tmp);
            setLogs(tmp);
        }
    }, []);

    useEffect(() => {
        getLogs();
    }, []);
    return (
        <div className={cx('his-manag')}>
            <div className={cx('list-item', 'list-nav', 'flex-center')}>
                <span className={cx('action')}>Action</span>
                <span className={cx('descript')}>Description</span>
                <span className={cx('time')}>Time</span>
            </div>
            {Logs.map((item, index) => {
                return (
                    <div key={index} className={cx('list-item', 'flex-center')}>
                        <span className={cx('action')}>{item.action}</span>
                        <span className={cx('descript')}>{item.description}</span>
                        <span className={cx('time')}>{item.time}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default HistoryManagement;
