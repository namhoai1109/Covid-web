import { Avatar, MaskIcon, SignOutIcon } from '~/CommonComponent/icons';
import SidebarItem, { AvatarItem } from '~/CommonComponent/SidebarItem';
import SidebarLayout from '~/Layout/Sidebar';
import configs from '~/config';
import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import { useNavigate } from 'react-router-dom';
import { resetDataCore } from '~/redux/dataCoreSlice';

const cx = classNames.bind(styles);

function SideBar() {
    let navigate = useNavigate()

    let handleSignOut = () => {
        localStorage.removeItem('Token');
        console.log('sign out');
        navigate('/', { replace: true });
    }

    return (
        <SidebarLayout>
            <div className={cx('wrapper')}>
                <div>
                    <div className={cx('avatar')}>
                        <AvatarItem id="20126045" icon={<Avatar width="4.5rem" height="4rem" />} />
                    </div>
                    <SidebarItem
                        title={'Manager'}
                        icon={<MaskIcon width="5rem" height="5rem" />}
                        path={configs.mainRoutes.admin + configs.adminRoutes.doctorManagement}
                    />
                    <SidebarItem
                        title={'Facility'}
                        icon={<MaskIcon width="5rem" height="5rem" />}
                        path={configs.mainRoutes.admin + configs.adminRoutes.facilityManagement}
                    />
                </div>
                <SidebarItem title={'Sign out'} icon={<SignOutIcon width="3rem" height="3rem" />} onClick={handleSignOut} />
            </div>
        </SidebarLayout>
    );
}

export default SideBar;
