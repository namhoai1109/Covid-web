import HeaderLayout from '~/Layout/Header';
import TaskBtn from '~/CommonComponent/TaskBtn';
import { PlusIcon, SearchIcon } from '~/CommonComponent/icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import SearchInput from '~/CommonComponent/SearchInput';
import { Menu } from '~/CommonComponent/Popper';
import { useLocation, useNavigate } from 'react-router-dom';
import configs from '~/config';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const menuManager = ['ID', 'Name', 'Year of Birth'];
const menuFacility = ['Name', 'Max no. patient', 'no. patient'];

let getFilterSortMenu = (menu) => {
    let filterItem = menu.map((title) => ({
        data: title,
        child: { data: [{ data: <SearchInput icon={<SearchIcon />} /> }] },
    }));

    let sortItem = menu.map((title) => ({
        data: title,
        child: { data: [{ data: 'Ascending' }, { data: 'Descending' }] },
    }));

    return [filterItem, sortItem];
};

let checkRoute = (location) => {
    switch (location) {
        case configs.mainRoutes.patient + configs.patientRoutes.essentialPackage:
            return true;
        case configs.mainRoutes.patient + configs.patientRoutes.personalInformation:
            return true;
        default:
            return false;
    }
};

function Header() {
    let location = useLocation();
    let navigate = useNavigate();
    let [showHeader, setShowHeader] = useState();

    useEffect(() => {
        if (checkRoute(location.pathname)) {
            setShowHeader(true);
        } else {
            setShowHeader(false);
        }
    }, [location.pathname]);

    let handleBack = () => {
        navigate(-1, { replace: true });
    };

    return (
        <HeaderLayout>
            {!showHeader ? <TaskBtn title="Back" onClick={handleBack} /> : <span></span>}
            {showHeader && (
                <div className={cx('list_btn')}>
                    <Menu menu={[]}>
                        <TaskBtn title="Filter" />
                    </Menu>
                    <Menu menu={[]}>
                        <TaskBtn title="Sort" />
                    </Menu>
                    {/* <SearchInput stateDynamique={true} icon={<SearchIcon />} /> */}
                </div>
            )}
        </HeaderLayout>
    );
}

export default Header;
