import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './Counting.module.scss';
const cx = classNames.bind(styles);

function Counting({ value, increasing, decreasing, hideBtn, minValue = 1, maxValue = 10000 }) {
    return (
        <div className={cx('wrapper', 'flex-center')}>
            <button
                onClick={value > minValue ? decreasing : () => {}}
                className={cx('btn', 'flex-center', {
                    disabled: value <= minValue,
                    hide: hideBtn,
                })}
            >
                <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className={cx('value')}>{value}</span>
            <button
                onClick={value < maxValue ? increasing : () => {}}
                className={cx('btn', 'flex-center', {
                    hide: hideBtn,
                    disabled: value >= maxValue,
                })}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
}

export default Counting;
