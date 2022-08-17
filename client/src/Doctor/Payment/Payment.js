import WrapContent from '~/CommonComponent/WrapContent';
import classNames from 'classnames/bind';
import styles from './Payment.module.scss';
import { FormInput } from '~/CommonComponent/Popper';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Payment() {
    let [valCredit, setValCredit] = useState();

    return (
        <div className={cx('wrapper')}>
            <WrapContent>
                <div className={cx('field')}>
                    <span className={cx('label')}>Credit limit: </span>
                    <span>20%</span>
                </div>
                <div className={cx('field', 'flex-center')}>
                    <span className={cx('label')}>Change credit limit: </span>
                    <FormInput
                        inputVal={valCredit}
                        onChange={(e) => {
                            setValCredit(e.target.value);
                        }}
                    />
                </div>
            </WrapContent>
        </div>
    );
}

export default Payment;
