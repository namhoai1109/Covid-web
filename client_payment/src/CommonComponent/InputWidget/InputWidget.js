import classNames from 'classnames/bind';
import styles from './InputWidget.module.scss';

const cx = classNames.bind(styles);

function InputWidget({ type = 'text', placeholder = '', value = '', onChange = () => {} }) {
    return <input className={cx('input')} type={type} placeholder={placeholder} value={value} onChange={onChange} />;
}

export default InputWidget;
