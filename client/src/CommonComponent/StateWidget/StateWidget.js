import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './StateWidget.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function StateWidget({ title, icon, onClick }) {
    return (
        <div className={cx('filter-state', 'flex-center')}>
            <span>{title}</span>
            <span className={cx('icon')}>{icon}</span>
            <span onClick={onClick} className={cx('delete-state', 'flex-center')}>
                <FontAwesomeIcon icon={faXmark} />
            </span>
        </div>
    );
}

export default memo(StateWidget);
