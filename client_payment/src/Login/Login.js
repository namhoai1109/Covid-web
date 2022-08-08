import { faIdCardClip, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import InputWidget from '~/CommonComponent/InputWidget';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

function Login() {
    return (
        <div className={cx('fit-screen', 'flex-center')}>
            <div className={cx('login-box', 'flex-center')}>
                <span className={cx('title')}>PAYMENT SYSTEM</span>
                <div className={cx('input-field')}>
                    <div className={cx('flex-center')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faIdCardClip} />
                        <InputWidget placeholder="enter ID number" />
                    </div>
                    <span className={cx('validate')}></span>
                </div>
                <div className={cx('input-field')}>
                    <div className={cx('flex-center')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faLock} />
                        <InputWidget placeholder="enter password" />
                    </div>
                    <span className={cx('validate')}></span>
                </div>
                <div className={cx('input-field')}>
                    <div className={cx('flex-center')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faLock} />
                        <InputWidget placeholder="enter password again" />
                    </div>
                    <span className={cx('validate')}></span>
                </div>

                <button className={cx('submit-btn')}>Sign In</button>
            </div>
        </div>
    );
}

export default Login;
