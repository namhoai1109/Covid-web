import { faAnglesRight, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import { putAPI, putNoDataAPI } from '~/APIservices/putAPI';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './Info.module.scss';
import TippyHeadless from '@tippyjs/react/headless';

const cx = classNames.bind(styles);

function Info() {
    let [info, setInfo] = useState(null);
    let [linkState, setLinkState] = useState(false);
    let [infoPay, setInfoPay] = useState({});
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

    let getInfo = useCallback(async () => {
        let info = await getAPI('patient/info');

        let tmp = null;
        if (info) {
            tmp = {
                Name: info.name,
                ['ID number']: info.id_number,
                ['Date of birth']: info.dob,
                Status: info.status,
                Address: info.address,
                Facility: `${info.current_facility.name}-${info.current_facility.location.formattedAddress}`,
            };
        }
        setInfo(tmp);
        setLinkState(info.account.linked);
    }, []);

    let getInfoPay = useCallback(async () => {
        let res = await getAPI('patient/paysys-info');
        // console.log(res);
        setInfoPay(res);
    }, []);

    useEffect(() => {
        getInfo();
        if (linkState) getInfoPay();
    }, [linkState]);

    let handleLink = useCallback(async () => {
        if (!linkState) {
            let res = await putNoDataAPI('patient/link');
            console.log(res);
            if (res.message && res.message === 'Account linked successfully') {
                setLinkState(true);
            }
        } else {
            window.open('http://localhost:2000', '_blank');
        }
    }, [linkState]);

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
            let res = await putAPI('patient/password', {
                old_password: inputPassword.oldPassword,
                new_password: inputPassword.newPassword,
            });
            console.log(res);
            if (res.response && res.response.status === 401) {
                setValidatePassword((prev) => ({
                    ...prev,
                    oldPassword: 'Old password is not match',
                }));
            }

            if (res.message && res.message === 'Password changed successfully') {
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
            <WrapContent>
                <div>
                    <TippyHeadless
                        interactive
                        offset={[0, 10]}
                        placement="top-start"
                        render={renderItem}
                        onHide={handleHide}
                        trigger="click"
                    >
                        <button className={cx('change-pass-btn')}>change password</button>
                    </TippyHeadless>
                </div>

                {info &&
                    Object.keys(info).map((key, index) => {
                        return (
                            <div key={index} className={cx('info-field', 'flex-center')}>
                                <span className={cx('label')}>{key}:</span>
                                <span className={cx('value')}>{info[key]}</span>
                            </div>
                        );
                    })}
                {linkState && (
                    <div className={cx('info-field', 'flex-center')}>
                        <span className={cx('label')}>Balance:</span>
                        <span className={cx('value')}>{infoPay.balance} VND</span>
                    </div>
                )}
                <div className={cx('link-payment', 'flex-center')}>
                    <button onClick={handleLink} className={cx('title')}>
                        {linkState ? 'Open payment system' : 'Link to payment system'}
                    </button>
                    <FontAwesomeIcon className={cx('icon')} icon={faAnglesRight} />
                </div>
            </WrapContent>
        </div>
    );
}

export default Info;
