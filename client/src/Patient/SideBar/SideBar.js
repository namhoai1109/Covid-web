import { Avatar, SignOutIcon } from '~/CommonComponent/icons';
import SidebarItem, { AvatarItem } from '~/CommonComponent/SidebarItem';
import SidebarLayout from '~/Layout/Sidebar';
import listItem from './listItem';

import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';

const cx = classNames.bind(styles);

function SideBar() {
    return (
        <SidebarLayout>
            <div className={cx('wrapper')}>
                <div>
                    <div className={cx('avatar')}>
                        <AvatarItem id="20126045" icon={<Avatar width="4.5rem" height="4rem" />} />
                    </div>
                    {listItem.map((item, index) => (
                        <SidebarItem large key={index} title={item.title} icon={item.icon} path={item.path} />
                    ))}
                </div>
                <SidebarItem title={'Sign out'} icon={<SignOutIcon width="3rem" height="3rem" />} path="/" />
            </div>
        </SidebarLayout>
    );
}

export default SideBar;
