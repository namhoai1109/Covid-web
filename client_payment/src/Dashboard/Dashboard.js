import { faPaperPlane, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAPI, postAPI } from '~/APIservices/postAPI';
import logo from '~/asset/svg/Vault-amico.svg';
import styles from './Dashboard.module.scss';

const cx = classNames.bind(styles);

function Dashboard() {
    let [infos, setInfos] = useState({
        username: '',
        balance: '',
    });

    let [deposit, setDeposit] = useState('');
    let [validate, setValidate] = useState('');
    let naviagate = useNavigate();

    let getInfo = useCallback(async () => {
        let res = await getAPI('main/info');
        setInfos({
            username: res.username,
            balance: res.balance,
        });
    }, []);

    let handleSubmit = useCallback(async () => {
        if (Number(deposit) > 0) {
            let token = JSON.parse(localStorage.getItem('Token')).token;
            let res = await postAPI(
                'main/deposit',
                {
                    amount: Number(deposit),
                },
                token,
            );

            if (res.message && res.message === 'Deposit made successfully') {
                getInfo();
                setDeposit('');
            }
        } else {
            setValidate('Please enter a valid amount');
        }
    }, [deposit]);

    useEffect(() => {
        getInfo();
    }, []);

    let handleLogOut = useCallback(() => {
        localStorage.removeItem('Token');
        naviagate('/', { replace: true });
    }, []);

    return (
        <div className={cx('fit-screen', 'flex-center')}>
            <div className={cx('container')}>
                <button onClick={handleLogOut} className={cx('logout', 'flex-center')}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
                <div className={cx('field', 'flex-center')}>
                    <span className={cx('label')}>ID:</span>
                    <span>{infos.username}</span>
                </div>
                <div className={cx('field', 'flex-center')}>
                    <span className={cx('label')}>Balance:</span>
                    <span>{infos.balance} VND</span>
                </div>

                <div className={cx('field', 'flex-center')}>
                    <span className={cx('label')}>Make deposit:</span>
                    <input
                        value={deposit}
                        onChange={(e) => {
                            setDeposit(e.target.value);
                            setValidate('');
                        }}
                        className={cx('input')}
                        type="number"
                    />
                    <button onClick={handleSubmit} className={cx('button')}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
                <span className={cx('validate')}>{validate}</span>
            </div>
            <img className={cx('logo')} src={logo} />
        </div>
    );
}

export default Dashboard;
