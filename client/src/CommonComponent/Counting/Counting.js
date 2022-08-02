import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './Counting.module.scss';
const cx = classNames.bind(styles);

function Counting({ value, increasing, decreasing, hideBtn }) {
    return (
        <div className={cx('wrapper', 'flex-center')}>
            <button
                onClick={value > 1 ? decreasing : () => {}}
                className={cx('btn', 'flex-center', {
                    disabled: value <= 1,
                    hide: hideBtn,
                })}
            >
                <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className={cx('value')}>{value}</span>
            <button
                onClick={increasing}
                className={cx('btn', 'flex-center', {
                    hide: hideBtn,
                })}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
}

export default Counting;
