import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import styles from './History.module.scss';
const cx = classNames.bind(styles);

function formatTime(time) {
  let tmp = time.split('T');
  let date = tmp[1].split('.')[0].split(':');
  let hour = Number(date[0]) + 7;
  let minute = date[1];
  let second = date[2];
  return tmp[0] + ' / ' + hour + 'h' + minute + 'm' + second + 's';
}

function HistoryPayment() {
  let [his, setHis] = useState([]);
  let getHis = useCallback(async () => {
    let his = await getAPI('patient/pay-logs');
    console.log(his);
    if (his.length > 0) {
      setHis(his);
    }
  }, []);

  useEffect(() => {
    getHis();
  }, []);

  return (
    <div className={cx('his-manag')}>
      <div className={cx('list-item', 'list-nav', 'flex-center')}>
        <span className={cx('time')}>Time</span>
        <span className={cx('descript')}>Description</span>
        <span>Amount</span>
      </div>
      <div className={cx('list')}>
        {his.map((item, index) => {
          return (
            <div key={index} className={cx('list-item', 'flex-center')}>
              <span className={cx('time')}>{formatTime(item.date)}</span>
              <span className={cx('descript')}>{item.description}</span>
              <span>{item.amount} VND</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryPayment;
