import classNames from 'classnames/bind';
import { useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { deleteAPI } from '~/APIservices/deleteAPI';
import { postAPI } from '~/APIservices/postAPI';
import styles from './GateWay.module.scss';
const cx = classNames.bind(styles);

function Pay({ billID }) {
    let [mess, setMess] = useState('');
    let [isDone, setIsDone] = useState(false);

    let handleCancel = async () => {
        let res = await deleteAPI('patient/delete-bill/id=' + billID);
        if (res.message && res.message === 'Bill deleted') {
            setIsDone(true);
            setMess('Your transaction is canceled!');
            localStorage.removeItem('Bill');
            localStorage.removeItem('TokenPay');
        }
    };

    let handleConfirm = async () => {
        let token = JSON.parse(localStorage.getItem('Token')).token;
        let res = await postAPI(
            'patient/pay-bill/id=' + billID,
            {
                paySysToken: JSON.parse(localStorage.getItem('TokenPay')).token,
            },
            token,
        );
        console.log(res);
        if (res.message && res.message === 'Bill paid, order successful, package usage saved') {
            setIsDone(true);
            setMess('Order successful!');
            localStorage.removeItem('Bill');
            localStorage.removeItem('TokenPay');
        }
    };

    return (
        <div className={cx('wrap-content', 'flex-center')}>
            {!isDone ? (
                <>
                    <span className={cx('big-title')}>Click Confirm to pay bill:</span>
                    <button onClick={handleConfirm} className={cx('submit-btn', 'confirm')}>
                        Confirm
                    </button>
                    <button onClick={handleCancel} className={cx('submit-btn', 'cancel')}>
                        Cancel
                    </button>
                </>
            ) : (
                <span className={cx('big-title')}>{mess}</span>
            )}
        </div>
    );
}

function Verify({ callback, bill }) {
    let [inputVals, setInputVals] = useState({
        username: '',
        password: '',
    });

    let [validate, setValidate] = useState('');

    let handleInput = (field, e) => {
        setInputVals({ ...inputVals, [field]: e.target.value });
        setValidate('');
    };

    let handleSubmit = () => {
        let isOke = true;
        if (inputVals.username !== bill.buyer.id_number) {
            setValidate('Username is not correct');
            isOke = false;
        } else if (inputVals.username === '' || inputVals.password === '') {
            setValidate('Username or password is not correct');
            isOke = false;
        }

        if (isOke) {
            fetch('https://localhost:9000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: inputVals.username,
                    password: inputVals.password,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    if (res.message && res.message === 'Invalid username or password') {
                        setValidate(res.message);
                    } else if (res.token) {
                        localStorage.setItem('TokenPay', JSON.stringify(res));
                        callback();
                    }
                });
        }
    };

    return (
        <div className={cx('wrap-content', 'flex-center')}>
            <span>
                <span className={cx('label')}>Bill of</span> {bill.buyer.name} - {bill.buyer.id_number}
            </span>
            <span>
                <span className={cx('label')}>Package name:</span> {bill.package.name}
            </span>
            <span className={cx('label')}>List product:</span>
            {bill.products_info.map((item, index) => {
                return (
                    <span key={index}>
                        {item.product.name} - {item.product.price} x{item.quantity}
                    </span>
                );
            })}
            <span>
                <span className={cx('label')}>Total price:</span> {bill.total_price}
            </span>
            <span className={cx('big-title')}>Login to pay bill</span>
            <input value={inputVals.username} onChange={(e) => handleInput('username', e)} placeholder="username" />
            <input
                value={inputVals.password}
                onChange={(e) => handleInput('password', e)}
                placeholder="password"
                type="password"
            />
            <span className={cx('validate')}>{validate}</span>
            <button onClick={handleSubmit} className={cx('submit-btn')}>
                Continue
            </button>
        </div>
    );
}

function Gateway() {
    let [switchFrame, setSwitchFrame] = useState(false);
    let bill = JSON.parse(localStorage.getItem('Bill'));
    console.log(bill);

    useBeforeunload(async (e) => {
        e.preventDefault();
        localStorage.removeItem('Bill');
        localStorage.removeItem('TokenPay');
        await deleteAPI('patient/delete-bill/id=' + bill._id);
    });

    return (
        <div className={cx('wrapper', 'flex-center')}>
            {!switchFrame ? (
                <Verify
                    callback={() => {
                        setSwitchFrame(true);
                    }}
                    bill={bill}
                />
            ) : (
                <Pay billID={bill._id} />
            )}
        </div>
    );
}

export default Gateway;
