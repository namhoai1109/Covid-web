import classNames from 'classnames/bind';
import styles from './SidebarItem.module.scss';
import { NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

function SidebarItem({ title, icon, path = '', onClick = () => [], large }) {
    let Comp = 'div';
    if (path !== '') {
        Comp = NavLink;
    }

    return (
        <div className={cx('wrapper')}>
            <Comp to={path} onClick={onClick} className={cx('sidebar-item')}>
                <div className={cx('icon', 'flex-center')}>{icon}</div>
            </Comp>
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
