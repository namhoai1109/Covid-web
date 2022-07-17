import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FormInput } from '~/CommonComponent/Popper';
import styles from './Login.module.scss';
import { postAPI } from '~/APIservices/postAPI';
import { useNavigate } from 'react-router-dom';
import { LockIcon, UserIcon } from '~/CommonComponent/icons';

const cx = classNames.bind(styles);

const fetchAPI = async (username, password) => {
    try {
        const Token = await postAPI('/auth/login', {
            username: username,
            password: password,
        });

        if (typeof Token === 'string') {
            throw Token;
        } else {
            localStorage.setItem('Token', JSON.stringify(Token));
            return Token;
        }
    } catch (error) {
        return error;
    }
};

function Login() {
    let navigate = useNavigate();
    let [ID, setID] = useState('');
    let [password, setPassword] = useState('');
    let [error, setError] = useState('');

    useEffect(() => {
        let Token = JSON.parse(localStorage.getItem('Token'));
        if (Token !== null) navigate('/' + Token.role, { replace: true });
    }, []);

    let handleClick = async () => {
        try {
            const Token = await fetchAPI(ID, password);
            if (typeof Token === 'string') {
                throw Token;
            } else {
                navigate('/' + Token.role, { replace: true });
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
                    <label>
                        <span className={cx('flex-center')}>
                            {' '}
                            <UserIcon />
                        </span>
                        <FormInput
                            onFocus={() => {
                                setError('');
                            }}
                            inputVal={ID}
                            onChange={(e) => setID(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            placeholder="username"
                        />
                    </label>
                    <label>
                        <span className={cx('flex-center')}>
                            <LockIcon />
                        </span>
                        <FormInput
                            onFocus={() => {
                                setError('');
                            }}
                            inputVal={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            type="password"
                            placeholder="password"
                        />{' '}
                    </label>
                    <span className={cx('error-message')}>{error}</span>
                    <button className={cx('btn')} onClick={handleClick}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
