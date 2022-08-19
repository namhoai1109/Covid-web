import HeaderLayout from '~/Layout/Header';
import TaskBtn from '~/CommonComponent/TaskBtn';
import { SearchIcon } from '~/CommonComponent/icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import SearchInput from '~/CommonComponent/SearchInput';
import { Menu } from '~/CommonComponent/Popper';
import { useLocation, useNavigate } from 'react-router-dom';
import configs from '~/config';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

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

function Header() {
    let location = useLocation();
    let navigate = useNavigate();
    let [showHeader, setShowHeader] = useState();
    let [showBack, setShowBack] = useState();

    useEffect(() => {
        if (location.pathname === configs.mainRoutes.patient + configs.patientRoutes.essentialPackage) {
            setShowHeader(true);
        } else {
            setShowHeader(false);
        }

        if (
            location.pathname ===
                configs.mainRoutes.patient +
                    configs.patientRoutes.essentialPackage +
                    configs.patientRoutes.infoPackage ||
            location.pathname ===
                configs.mainRoutes.patient + configs.patientRoutes.essentialPackage + configs.patientRoutes.infoProduct
        ) {
            setShowBack(true);
        } else {
            setShowBack(false);
        }
    }, [location.pathname]);

    let handleBack = () => {
        navigate(-1, { replace: true });
    };

    return (
        <HeaderLayout>
            {!showHeader && showBack ? <TaskBtn title="Back" onClick={handleBack} /> : <span></span>}
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
