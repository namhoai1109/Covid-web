import WrapContent from '~/CommonComponent/WrapContent';
import classNames from 'classnames/bind';
import styles from './ManagerPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { deleteId } from '../redux/hisDoctor';
import { getAPI } from '~/APIservices/getAPI';
const cx = classNames.bind(styles);

function HistoryDoctor() {
    let idDoctor = useSelector((state) => state.hisDoctor.id);
    let dispatch = useDispatch();
    let [Logs, setLogs] = useState([]);

    let getHis = useCallback(async () => {
        let res = await getAPI(`admin/doctors/id=${idDoctor}/logs`);
        console.log(res);
        if (res.length > 0) {
            let tmp = res.map((item) => {
                return {
                    action: item.action,
                    description: item.description.replaceAll('\n', ' | '),
                    time: item.time.split('T')[0],
                };
            });
            setLogs(tmp);
        }
    }, [idDoctor]);

    useEffect(() => {
        getHis();
        return () => {
            dispatch(deleteId());
        };
    }, []);
    return (
        <div className={cx('wrapper')}>
            <WrapContent>
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
            </WrapContent>
        </div>
    );
}

export default HistoryDoctor;
