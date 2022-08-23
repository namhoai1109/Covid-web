import { Avatar } from '~/CommonComponent/icons';
import SidebarItem, { AvatarItem } from '~/CommonComponent/SidebarItem';
import SidebarLayout from '~/Layout/Sidebar';
import listItem from './listItem';

import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function SideBar() {
    let navigate = useNavigate();

    let handleSignOut = () => {
        localStorage.removeItem('Token');
        console.log('sign out');
        navigate('/', { replace: true });
    };

    let id = JSON.parse(localStorage.getItem('Token')).username;

    return (
        <SidebarLayout>
            <div className={cx('wrapper')}>
                <div>
                    <div className={cx('avatar')}>
                        <AvatarItem id={id} icon={<Avatar width="4.5rem" height="4rem" />} />
                    </div>
                    {listItem.map((item, index) => (
                        <SidebarItem key={index} title={item.title} icon={item.icon} path={item.path} />
                    ))}
                </div>
                <SidebarItem
                    title={'Sign out'}
                    icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                    onClick={handleSignOut}
                />
            </div>
        </SidebarLayout>
    );
}

export default SideBar;
