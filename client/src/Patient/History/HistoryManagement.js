import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import styles from './History.module.scss';
const cx = classNames.bind(styles);

function HistoryManagement() {
  let [Logs, setLogs] = useState([]);
  function formatTime(time) {
    let tmp = time.split('T');
    let date = tmp[1].split('.')[0].split(':');
    let hour = Number(date[0]) + 7;
    let minute = date[1];
    let second = date[2];
    return tmp[0] + ' / ' + hour + 'h' + minute + 'm' + second + 's';
  }

  let getLogs = useCallback(async () => {
    let res = await getAPI('patient/logs');
    if (res.length > 0) {
      let tmp = res.map((item) => {
        return {
          action: item.action,
          description: item.description.replaceAll('\n', ' | '),
          time: formatTime(item.time),
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
        <span className={cx('time')}>Time</span>
        <span className={cx('descript')}>Description</span>
        <span className={cx('action')}>Action</span>
      </div>
      <div className={cx('list')}>
        {Logs.map((item, index) => {
          return (
            <div key={index} className={cx('list-item', 'flex-center')}>
              <span className={cx('time')}>{item.time}</span>
              <span className={cx('descript')}>{item.description}</span>
              <span className={cx('action')}>{item.action}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryManagement;
