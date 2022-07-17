import classNames from 'classnames/bind';
import styles from './Wrapper.module.scss';

const cx = classNames.bind(styles);

function FormInput({
    inputVal = '',
    onChange = () => {},
    onFocus = () => {},
    onClick = () => {},
    onKeyDown = () => {},
    type = 'text',
    placeholder = '',
    passGen,
}) {
    return (
        <div className={cx('form-input')}>
            <input
                placeholder={placeholder}
                type={type}
                value={inputVal}
                onChange={onChange}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                className={cx('input')}
                readOnly={passGen}
            />
            {passGen && (
                <button onClick={onClick} className={cx('btn')}>
                    Generate
                </button>
            )}
        </div>
    );
}

export default FormInput;
