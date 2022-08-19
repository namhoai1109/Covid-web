import { faPaperPlane, faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
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

    let getInfo = useCallback(async () => {
        let id = JSON.parse(localStorage.getItem('ID'));
        let res = await getAPI('/main/info/id=' + id);
        setInfos({
            username: res.username,
            balance: res.balance,
        });
    }, []);

    let handleSubmit = useCallback(async () => {
        if (Number(deposit) > 0) {
            let id = JSON.parse(localStorage.getItem('ID'));
            let res = await postAPI('main/deposit/id=' + id, {
                amount: Number(deposit),
            });

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

    return (
        <div className={cx('fit-screen', 'flex-center')}>
            <div className={cx('container')}>
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
