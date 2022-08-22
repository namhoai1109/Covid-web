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
import { useDispatch } from 'react-redux';
import { setSort } from '~/Doctor/redux/filterState';

const cx = classNames.bind(styles);
const essentialPackageFields = ['Name', 'Time limit'];

let SortBtn = ({ sort_by, sort_order, children }) => {
    let dispatch = useDispatch();
    let nSort_by = sort_by.replaceAll(' ', '_');
    let handleSortState = () => {
        dispatch(
            setSort({
                sort_by: nSort_by.toLowerCase(),
                sort_order: sort_order.toLowerCase(),
            }),
        );
    };
    return (
        <div className={cx('sub-btn')} onClick={handleSortState}>
            {children}
        </div>
    );
};

let getFilterSortMenu = (menu) => {
    let filterItem = menu.map((title) => ({
        data: title,
        child: {
            data: [{ data: <SearchInput filter={title} icon={<SearchIcon />} /> }],
        },
    }));

    let sortItem = menu.map((title) => ({
        data: title,
        child: {
            data: [
                {
                    data: (
                        <SortBtn sort_by={title} sort_order={'Asc'}>
                            Ascending
                        </SortBtn>
                    ),
                },
                {
                    data: (
                        <SortBtn sort_by={title} sort_order={'Desc'}>
                            Descending
                        </SortBtn>
                    ),
                },
            ],
        },
    }));

    return [filterItem, sortItem];
};

function Header() {
    let location = useLocation();
    let navigate = useNavigate();
    let [showHeader, setShowHeader] = useState();
    let [showBack, setShowBack] = useState();
    let [paramHeader, setParamHeader] = useState({
        filter: [],
        sort: [],
    });

    useEffect(() => {
        if (location.pathname === configs.mainRoutes.patient + configs.patientRoutes.essentialPackage) {
            setShowHeader(true);
            let [filter, sort] = getFilterSortMenu(essentialPackageFields);
            setParamHeader({ filter, sort });
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
                    <Menu menu={paramHeader.filter}>
                        <TaskBtn title="Filter" />
                    </Menu>
                    <Menu menu={paramHeader.sort}>
                        <TaskBtn title="Sort" />
                    </Menu>
                    <SearchInput stateDynamique={true} icon={<SearchIcon />} />
                </div>
            )}
        </HeaderLayout>
    );
}

export default Header;
