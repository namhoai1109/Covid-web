import classNames from 'classnames/bind';
import styles from './SidebarItem.module.scss';

import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SidebarItem({ title, icon, path = '', large }) {
    return (
        <div className={cx('wrapper')}>
            <Link to={path} className={cx('sidebar-item')}>
                <div className={cx('icon', 'flex-center')}>{icon}</div>
            </Link>
            <div
                className={cx('sub-title', {
                    large: large,
                })}
            >
                {title}
            </div>
        </div>
    );
}

export default SidebarItem;
