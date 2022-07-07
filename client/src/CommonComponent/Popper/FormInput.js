import classNames from 'classnames/bind';
import styles from './Wrapper.module.scss';

const cx = classNames.bind(styles);

function FormInput({ inputVal = '', onChange, onFocus = () => {}, type = "text", placeholder = "" }) {
    return (
        <div className={cx('form-input')}>
            <input placeholder={placeholder} type={type} value={inputVal} onChange={onChange} onFocus={onFocus} className={cx('input')} />
        </div>
    );
}

export default FormInput;
