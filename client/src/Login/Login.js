import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FormInput } from '~/CommonComponent/Popper';
import styles from './Login.module.scss';
import { postAPI } from '~/APIservices/postAPI';
import { useNavigate } from 'react-router-dom';
import { LockIcon, UserIcon } from '~/CommonComponent/icons';

const cx = classNames.bind(styles);

const fetchPostAPI = async (url, username, password) => {
    try {
        const Token = await postAPI(url, {
            username: username,
            password: password,
        });

        if (typeof Token === 'string') {
            throw Token;
        } else {
            return Token;
        }
    } catch (error) {
        return error;
    }
};

const checkAccount = async (username) => {
    try {
        const check = await postAPI('/auth/check', {
            username: username,
        });
        return check;
    } catch (error) {
        return error;
    }
};

function Login() {
    let navigate = useNavigate();

    let [ID, setID] = useState('');
    let [password, setPassword] = useState('');
    let [checkPassword, setCheckPassword] = useState('');
    let [error, setError] = useState('');
    let [existAdmin, setExistAdmin] = useState(false);
    let [noti, setNoti] = useState('');

    let [showPassInput, setShowPassInput] = useState([false, false]);
    let [isValidAccount, setIsValidAccount] = useState('');

    let checkAdmin = async () => {
        let check = await postAPI('auth/init', {});
        setExistAdmin(check.message);
        if (check.message === 'False') {
            setNoti('Create account Admin');
            setShowPassInput([true, true]);
        }
    };

    useEffect(() => {
        let Token = JSON.parse(localStorage.getItem('Token'));
        if (Token !== null) navigate('/' + Token.role, { replace: true });
        checkAdmin();
    }, []);

    let handleClick = async () => {
        try {
            if (!isValidAccount && existAdmin === 'True') {
                let check = await checkAccount(ID);
                if (typeof check === 'string') {
                    setError(check);
                } else {
                    if (check.message === true) {
                        setShowPassInput([true, false]);
                    } else if (check.message === false) {
                        setShowPassInput([true, true]);
                    }
                    setIsValidAccount(true);
                }
            } else {
                let isSuccess = false;
                if (showPassInput[1]) {
                    let route = existAdmin === 'True' ? 'auth/update-password' : 'auth/init-admin';
                    if (password === '' || checkPassword === '') {
                        setError('Password is empty');
                        isSuccess = false;
                    } else if (password.length < 6) {
                        setError('Password is too short');
                        isSuccess = false;
                    } else if (password === checkPassword) {
                        let res = await fetchPostAPI(route, ID, password);
                        console.log(res);
                        if (res.message) {
                            isSuccess = true;
                        }
                    } else {
                        setError('Password not match');
                        isSuccess = false;
                    }
                }

                if (!showPassInput[1] || isSuccess) {
                    let Token = await fetchPostAPI('/auth/login', ID, password);
                    if (typeof Token === 'string') {
                        setError(Token);
                    } else {
                        localStorage.setItem('Token', JSON.stringify(Token));
                        navigate('/' + Token.role, { replace: true });
                    }
                }
            }
        } catch (error) {
            setError(error);
        }
    };

    let handleKeyDown = (e) => {
        if (e.key === 'Enter') handleClick();
    };

    return (
        <div className={cx('wrapper', 'bg', 'flex-center')}>
            <div className={cx('ball1', 'bg-ball')}></div>
            <div className={cx('oval1')}></div>
            <div className={cx('wrap-form')}>
                <div className={cx('white-ball-cover')}>
                    <div className={cx('white-ball')}></div>
                </div>
                <div className={cx('small-ball')}></div>

                <div className={cx('ball', 'bg-ball')}></div>
                <div className={cx('oval')}></div>

                <div className={cx('form', 'flex-center', 'glassmorphism')}>
                    <div className={cx('noti')}>{noti}</div>
                    <label>
                        <span className={cx('flex-center')}>
                            {' '}
                            <UserIcon />
                        </span>
                        <FormInput
                            inputVal={ID}
                            onChange={(e) => {
                                setError('');
                                setID(e.target.value);
                                if (existAdmin === 'True') {
                                    setShowPassInput([false, false]);
                                }
                                setIsValidAccount(false);
                                setCheckPassword('');
                                setPassword('');
                            }}
                            onKeyDown={(e) => handleKeyDown(e)}
                            placeholder="enter username"
                        />
                    </label>
                    {showPassInput[0] && (
                        <label>
                            <span className={cx('flex-center')}>
                                <LockIcon />
                            </span>
                            <FormInput
                                inputVal={password}
                                onChange={(e) => {
                                    setError('');
                                    setPassword(e.target.value);
                                }}
                                onKeyDown={(e) => handleKeyDown(e)}
                                type="password"
                                placeholder={showPassInput[1] ? 'enter new password' : 'enter password'}
                            />{' '}
                        </label>
                    )}
                    {showPassInput[1] && (
                        <label>
                            <span className={cx('flex-center')}>
                                <LockIcon />
                            </span>
                            <FormInput
                                inputVal={checkPassword}
                                onChange={(e) => {
                                    setError('');
                                    setCheckPassword(e.target.value);
                                }}
                                onKeyDown={(e) => handleKeyDown(e)}
                                type="password"
                                placeholder="enter password again"
                            />{' '}
                        </label>
                    )}
                    <span className={cx('error-message')}>{error}</span>
                    <button className={cx('btn')} onClick={handleClick}>
                        {showPassInput[1] || existAdmin === 'False' ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
