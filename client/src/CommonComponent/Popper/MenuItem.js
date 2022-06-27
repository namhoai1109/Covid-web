import PropTypes from 'prop-types';
import styles from './Wrapper.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function MenuItem({ data, onClick, className }) {
    return (
        <div
            className={cx('item', {
                [className]: className,
            })}
            onClick={onClick}
        >
            {data}
        </div>
    );
}

MenuItem.propTypes = {
    onClick: PropTypes.func,
};

export default MenuItem;
