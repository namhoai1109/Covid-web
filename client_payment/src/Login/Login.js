import { faIdCardClip, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '~/APIservices/postAPI';
import InputWidget from '~/CommonComponent/InputWidget';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

function Login() {
    let [showPassword, setShowPassword] = useState([false, false]);
    let [inputVals, setInputVals] = useState({
        username: '',
        password: '',
        password_again: '',
    });
    let [error, setError] = useState('');
    let [isValidAccount, setIsValidAccount] = useState(false);
    let navigate = useNavigate();

    let checkUsername = useCallback(async () => {
        let res = await postAPI('auth/check', {
            username: inputVals.username,
        });

        console.log(res);
        if (res === 'Invalid username') {
            setError(res);
            setIsValidAccount(false);
        } else {
            if (res.message) {
                setShowPassword([true, false]);
            } else {
                setShowPassword([true, true]);
            }
            setIsValidAccount(true);
        }
    });

    let handleSubmit = useCallback(async () => {
        if (!isValidAccount) {
            checkUsername();
        } else {
            let isSuccess = false;
            if (showPassword[1]) {
                if (inputVals.password !== inputVals.password_again) {
                    setError('Password not match');
                } else {
                    let res = await postAPI('auth/update-password', {
                        username: inputVals.username,
                        password: inputVals.password,
                    });
                    if (res.message && res.message === 'Password changed successfully') {
                        isSuccess = true;
                    }
                }
            }

            if (!showPassword[1] || isSuccess) {
                let res = await postAPI('auth/login', {
                    username: inputVals.username,
                    password: inputVals.password,
                });
                console.log(res);
                if (res === 'Invalid username or password') {
                    setError(res);
                } else if (res.message === 'Logged in successfully') {
                    localStorage.setItem('ID', JSON.stringify(inputVals.username));
                    navigate('/dashboard', { replace: true });
                }
            }
        }
    });

    let handleChangeID = useCallback((e) => {
        setError('');
        setShowPassword([false, false]);
        setInputVals((prev) => ({
            ...prev,
            username: e.target.value,
        }));
        setIsValidAccount(false);
    });

    let handlePass = useCallback((e) => {
        setError('');
        setInputVals((prev) => ({
            ...prev,
            password: e.target.value,
        }));
    });

    let handlePassAgain = useCallback((e) => {
        setError('');
        setInputVals((prev) => ({
            ...prev,
            password_again: e.target.value,
        }));
    });

    let handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') handleSubmit();
    });

    return (
        <div className={cx('fit-screen', 'flex-center')}>
            <div className={cx('login-box', 'flex-center')}>
                <span className={cx('title')}>PAYMENT SYSTEM</span>
                <div className={cx('input-field', 'flex-center')}>
                    <FontAwesomeIcon className={cx('icon')} icon={faIdCardClip} />
                    <InputWidget
                        value={inputVals.username}
                        onKeyDown={handleKeyDown}
                        onChange={handleChangeID}
                        placeholder="enter ID number"
                    />
                </div>
                {showPassword[0] && (
                    <div className={cx('input-field', 'flex-center')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faLock} />
                        <InputWidget
                            onChange={handlePass}
                            value={inputVals.password}
                            type="password"
                            placeholder="enter password"
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                )}
                {showPassword[1] && (
                    <div className={cx('input-field', 'flex-center')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faLock} />
                        <InputWidget
                            value={inputVals.password_again}
                            onChange={handlePassAgain}
                            type="password"
                            onKeyDown={handleKeyDown}
                            placeholder="enter password again"
                        />
                    </div>
                )}
                <span className={cx('error', 'flex-center')}>{error}</span>
                <button onClick={handleSubmit} className={cx('submit-btn')}>
                    Sign In
                </button>
            </div>
        </div>
    );
}

export default Login;
