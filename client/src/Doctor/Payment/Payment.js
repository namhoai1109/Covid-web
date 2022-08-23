import WrapContent from '~/CommonComponent/WrapContent';
import classNames from 'classnames/bind';
import styles from './Payment.module.scss';
import { FormInput } from '~/CommonComponent/Popper';
import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { getAPI } from '~/APIservices/getAPI';
import { putAPI } from '~/APIservices/putAPI';
import ListItem from '~/CommonComponent/ListItem';
import { postAPI } from '~/APIservices/postAPI';

const cx = classNames.bind(styles);

function Payment() {
  let [valCredit, setValCredit] = useState('');
  let [curCredit, setCurCredit] = useState('');
  let [listPayAcc, setListPayAcc] = useState([]);

  let getCurCredit = useCallback(async () => {
    let res = await getAPI('doctor/patients/credit-limit');
    setCurCredit((res.credit_limit * 100).toFixed(0) + '% value of package');
  }, []);

  let changeCredit = useCallback(
    async (e) => {
      let res = await putAPI('doctor/patients/credit-limit', {
        credit_limit: Number(valCredit) / 100,
      });

      console.log(res);
      // console.log(Number(valCredit) / 100);
      if (res.message && res.message === 'Credit limit updated successfully') getCurCredit();
    },
    [valCredit],
  );

  let getListPayemtAccount = useCallback(async () => {
    let res = await getAPI('doctor/patients/with-ps-account');
    console.log(res);
    if (res.length > 0) setListPayAcc(res);
  }, []);

  let handleSubmitCredit = useCallback(() => {
    if (valCredit !== '') {
      changeCredit().then(() => {
        getListPayemtAccount();
      });
      setValCredit('');
    } else {
      console.log('empty');
    }
  }, [valCredit]);

  let handleMakeNoti = useCallback(async (id_number) => {
    let token = JSON.parse(localStorage.getItem('Token')).token;
    let res = await postAPI('doctor/patients/debt-notification', {
      id_number: id_number,
    }, token)
    console.log(res);
  }, [])

  let handleSendNotiAll = useCallback(async () => {
    let token = JSON.parse(localStorage.getItem('Token')).token;
    let tmp = [];
    listPayAcc.forEach(item => {
      if (item.in_debt) tmp.push(item.id_number);
    })
    if (tmp.length > 0) {
      let res = await postAPI('doctor/patients/debt-notification-all', {
        id_numbers: tmp,
      }, token)
      console.log(res);
    }

  }, [listPayAcc])

  useEffect(() => {
    getCurCredit();
    getListPayemtAccount();
  }, []);

  return (
    <div className={cx('wrapper')}>
      <WrapContent>
        <div className={cx('field')}>
          <span className={cx('label')}>Credit limit: </span>
          <span>{curCredit}</span>
        </div>
        <div className={cx('field', 'flex-center')}>
          <span className={cx('label')}>Change credit limit: </span>
          <FormInput
            inputVal={valCredit}
            onChange={(e) => {
              setValCredit(e.target.value);
            }}
            placeholder="ex: 10% -> enter 10"
            type="number"
          />
          <div onClick={handleSubmitCredit} className={cx('submit-btn')}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
        </div>
        <div className={cx('wrap-list')}>
          <div className={cx('flex-center', 'space-between')}>
            <div className={cx('title-list')}>List Payment Account</div>
            <button onClick={handleSendNotiAll} className={cx('noti-btn')}>send notification to all patients in debt</button>
          </div>
          <ListItem noUnderLine infos={{
            a: <span className={cx('title')}>Name</span>,
            b: <span className={cx('title')}>ID number</span>,
            c: <span className={cx('title')}>Credit</span>,
            d: <span className={cx('title')}>Debt</span>,
            e: '',
          }} />

          {listPayAcc.map((item, index) => {
            let nForm = {
              name: item.name,
              id_number: item.id_number,
              credit: (item.credit_limit * 100).toFixed(0) + '%',
              debt: item.in_debt + '',
              btn: item.in_debt && <button onClick={() => handleMakeNoti(item.id_number)} className={cx('noti-btn')}>send notification</button>
            };
            return (
              <ListItem key={index} infos={nForm} />
            );
          })}
        </div>
      </WrapContent>
    </div>
  );
}

export default Payment;
