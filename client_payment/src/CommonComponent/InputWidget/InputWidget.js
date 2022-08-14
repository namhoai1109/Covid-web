import classNames from 'classnames/bind';
import styles from './InputWidget.module.scss';

const cx = classNames.bind(styles);

function InputWidget({ type = 'text', placeholder = '', value = '', onKeyDown = () => {}, onChange = () => {} }) {
    return (
        <input
            onKeyDown={onKeyDown}
            className={cx('input')}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}

export default InputWidget;
