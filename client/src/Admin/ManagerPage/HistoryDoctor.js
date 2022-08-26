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

  function formatTime(time) {
    let tmp = time.split('T');
    let date = tmp[1].split('.')[0].split(':');
    let hour = Number(date[0]) + 7;
    let minute = date[1];
    let second = date[2];
    return tmp[0] + ' / ' + hour + 'h' + minute + 'm' + second + 's';
  }

  let getHis = useCallback(async () => {
    let res = await getAPI(`admin/doctors/id=${idDoctor}/logs`);
    console.log(res);
    if (res.length > 0) {
      let tmp = res.map((item) => {
        return {
          action: item.action,
          description: item.description.replaceAll('\n', ' | '),
          time: formatTime(item.time),
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
