import classNames from 'classnames/bind';
import styles from './Wrapper.module.scss';

const cx = classNames.bind(styles);

function FormInput({ inputVal = '', onChange, type = "text" }) {
    return (
        <div className={cx('form-input')}>
            <input type={type}  value={inputVal} onChange={onChange} className={cx('input')} />
        </div>
    );
}

export default FormInput;
