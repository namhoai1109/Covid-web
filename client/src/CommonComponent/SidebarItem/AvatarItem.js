import classNames from 'classnames/bind';
import styles from './SidebarItem.module.scss';

const cx = classNames.bind(styles);

function AvatarItem({ id, icon }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrap-avatar')}>
                <div className={cx('avatar')}>{icon}</div>
            </div>
            <div className={cx('sub-title')}>{id}</div>
        </div>
    );
}

export default AvatarItem;
