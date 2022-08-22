import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import styles from './History.module.scss';
const cx = classNames.bind(styles);

function HistoryPayment() {
    let [his, setHis] = useState([]);
    let getHis = useCallback(async () => {
        let his = await getAPI('patient/pay-logs');
        console.log(his);
        setHis(his);
    }, []);

    useEffect(() => {
        getHis();
    }, []);

    return (
        <div className={cx('his-manag')}>
            <div className={cx('list-item', 'list-nav', 'flex-center')}>
                <span className={cx('action')}>Time</span>
                <span className={cx('descript')}>Description</span>
                <span>Amount</span>
            </div>
            {his.map((item, index) => {
                return (
                    <div key={index} className={cx('list-item', 'flex-center')}>
                        <span className={cx('action')}>{item.date.split('T')[0]}</span>
                        <span className={cx('descript')}>{item.description}</span>
                        <span>{item.amount} VND</span>
                    </div>
                );
            })}
        </div>
    );
}

export default HistoryPayment;
