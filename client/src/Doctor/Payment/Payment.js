import WrapContent from '~/CommonComponent/WrapContent';
import classNames from 'classnames/bind';
import styles from './Payment.module.scss';
import { FormInput } from '~/CommonComponent/Popper';
import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { getAPI } from '~/APIservices/getAPI';
import { putAPI } from '~/APIservices/putAPI';

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
                    <div className={cx('title-list')}>List Payment Account</div>
                    <div className={cx('item', 'flex-center')}>
                        <div className={cx('info1')}>
                            <span className={cx('id', 'title')}>ID number</span>
                            <span className={cx('name', 'title')}>Name</span>
                        </div>
                        <span className={cx('credit', 'title')}>Credit</span>
                    </div>
                    {listPayAcc.map((item, index) => {
                        let nForm = {
                            name: item.name,
                            id_number: item.id_number,
                            credit: (item.credit_limit * 100).toFixed(0) + '%',
                        };
                        return (
                            <div className={cx('item', 'flex-center')} key={index}>
                                <div className={cx('info1')}>
                                    <span className={cx('id')}>{nForm.id_number}</span>
                                    <span className={cx('name')}>{nForm.name}</span>
                                </div>
                                <span className={cx('credit')}>{nForm.credit}</span>
                            </div>
                        );
                    })}
                </div>
            </WrapContent>
        </div>
    );
}

export default Payment;
