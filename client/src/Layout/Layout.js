import { faFloppyDisk, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import styles from './Layout.module.scss';
import { useCallback, useState } from 'react';
import { putAPI } from '~/APIservices/putAPI';

const cx = classNames.bind(styles);

function Layout({ Header, Sidebar, children }) {
    let [notiSuccess, setNotiSuccess] = useState('');
    let [inputPassword, setInputPassword] = useState({
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: '',
    });

    let [validatePassword, setValidatePassword] = useState({
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: '',
    });

    let handleSubmit = useCallback(async () => {
        let isOke = true;

        Object.keys(inputPassword).forEach((key) => {
            if (inputPassword[key] === '') {
                setValidatePassword((prev) => ({
                    ...prev,
                    [key]: 'This field is required',
                }));
                isOke = false;
            }
        });

        if (inputPassword.newPassword !== '') {
            if (inputPassword.newPassword.length < 6) {
                setValidatePassword((prev) => ({
                    ...prev,
                    newPassword: 'At least 6 characters',
                }));
                isOke = false;
            }
        }

        if (inputPassword.newPassword !== inputPassword.newPasswordAgain) {
            setValidatePassword((prev) => ({
                ...prev,
                newPasswordAgain: 'New password is not match',
            }));
            isOke = false;
        }

        if (isOke) {
            let res = await putAPI('doctor/password', {
                old_password: inputPassword.oldPassword,
                new_password: inputPassword.newPassword,
            });
            console.log(res);
            if (res.response && res.response.status === 400) {
                setValidatePassword((prev) => ({
                    ...prev,
                    oldPassword: 'Old password is not match',
                }));
            }

            if (res.message && res.message === 'Password changed') {
                setInputPassword({
                    oldPassword: '',
                    newPassword: '',
                    newPasswordAgain: '',
                });
                setNotiSuccess(res.message);
            }
        }
    }, [inputPassword]);

    let renderItem = (attrs) => (
        <div tabIndex="-1" {...attrs}>
            <div className={cx('wrap-popper', 'flex-center')}>
                <FontAwesomeIcon onClick={handleSubmit} className={cx('save-btn')} icon={faFloppyDisk} />
                <span className={cx('noti-success')}>{notiSuccess}</span>
                <div className={cx('wrap-input', 'flex-center')}>
                    <input
                        value={inputPassword.oldPassword}
                        onChange={(e) => {
                            setInputPassword((prev) => ({
                                ...prev,
                                oldPassword: e.target.value,
                            }));
                            setValidatePassword((prev) => ({
                                ...prev,
                                oldPassword: '',
                            }));
                            setNotiSuccess('');
                        }}
                        className={cx('input')}
                        placeholder="enter old password"
                    />
                    <span className={cx('validation')}>{validatePassword.oldPassword}</span>
                </div>
                <div className={cx('wrap-input', 'flex-center')}>
                    <input
                        value={inputPassword.newPassword}
                        onChange={(e) => {
                            setInputPassword((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                            }));
                            setValidatePassword((prev) => ({
                                ...prev,
                                newPassword: '',
                            }));
                            setNotiSuccess('');
                        }}
                        className={cx('input')}
                        placeholder="enter new password"
                    />
                    <span className={cx('validation')}>{validatePassword.newPassword}</span>
                </div>
                <div className={cx('wrap-input', 'flex-center')}>
                    <input
                        value={inputPassword.newPasswordAgain}
                        onChange={(e) => {
                            setInputPassword((prev) => ({
                                ...prev,
                                newPasswordAgain: e.target.value,
                            }));
                            setValidatePassword((prev) => ({
                                ...prev,
                                newPasswordAgain: '',
                            }));
                            setNotiSuccess('');
                        }}
                        className={cx('input')}
                        placeholder="enter new password again"
                    />
                    <span className={cx('validation')}>{validatePassword.newPasswordAgain}</span>
                </div>
            </div>
        </div>
    );

    let handleHide = useCallback(() => {
        setInputPassword({
            oldPassword: '',
            newPassword: '',
            newPasswordAgain: '',
        });
        setValidatePassword({
            oldPassword: '',
            newPassword: '',
            newPasswordAgain: '',
        });
        setNotiSuccess('');
    }, []);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container', 'bg')}>
                <Sidebar />
                <div className={cx('content', 'flex-center')}>
                    <div className={cx('ball', 'bg-ball')}></div>
                    <div className={cx('ball1', 'bg-ball')}></div>
                    <div className={cx('ball2', 'bg-ball')}></div>
                    <div className={cx('oval')}></div>
                    <div className={cx('oval2')}></div>
                    {children}
                </div>

                {JSON.parse(localStorage.getItem('Token')).role === 'doctor' && (
                    <TippyHeadless
                        interactive
                        offset={[0, 10]}
                        placement="top-start"
                        render={renderItem}
                        onHide={handleHide}
                        trigger="click"
                    >
                        <button className={cx('fixed-btn')}>
                            <FontAwesomeIcon icon={faUnlockKeyhole} />
                        </button>
                    </TippyHeadless>
                )}
            </div>
        </div>
    );
}

export default Layout;
