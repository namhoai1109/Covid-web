import PropTypes from 'prop-types';
import styles from './Wrapper.module.scss';
import classNames from 'classnames/bind';
import { memo } from 'react';
const cx = classNames.bind(styles);

function MenuItem({ data, onClick, className, nohover }) {
    return (
        <div
            className={cx(
                'item',
                {
                    'no-hover': nohover,
                },
                {
                    [className]: className,
                },
            )}
            onClick={onClick}
        >
            {data}
        </div>
    );
}

MenuItem.propTypes = {
    onClick: PropTypes.func,
};

export default memo(MenuItem);
