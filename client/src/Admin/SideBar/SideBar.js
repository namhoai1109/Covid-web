import { Avatar, MaskIcon, SignOutIcon } from '~/CommonComponent/icons';
import SidebarItem, { AvatarItem } from '~/CommonComponent/SidebarItem';
import SidebarLayout from '~/Layout/Sidebar';
import configs from '~/config';
import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseMedical, faRightFromBracket, faUserDoctor } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function SideBar() {
    let navigate = useNavigate();
    let id = JSON.parse(localStorage.getItem('Token')).username;

    let handleSignOut = () => {
        localStorage.removeItem('Token');
        console.log('sign out');
        navigate('/', { replace: true });
    };

    return (
        <SidebarLayout>
            <div className={cx('wrapper')}>
                <div>
                    <div className={cx('avatar')}>
                        <AvatarItem id={id} icon={<Avatar width="4.5rem" height="4rem" />} />
                    </div>
                    <SidebarItem
                        title={'Manager'}
                        icon={<FontAwesomeIcon icon={faUserDoctor} />}
                        path={configs.mainRoutes.admin + configs.adminRoutes.doctorManagement}
                    />
                    <SidebarItem
                        title={'Facility'}
                        icon={<FontAwesomeIcon icon={faHouseMedical} />}
                        path={configs.mainRoutes.admin + configs.adminRoutes.facilityManagement}
                    />
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
