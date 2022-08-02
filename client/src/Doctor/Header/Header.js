import HeaderLayout from '~/Layout/Header';
import TaskBtn from '~/CommonComponent/TaskBtn';
import { PlusIcon, SearchIcon } from '~/CommonComponent/icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import SearchInput from '~/CommonComponent/SearchInput';
import { Menu } from '~/CommonComponent/Popper';
import { patientFields, necessityFields, essentialPackageFields, patientSortFilter } from '../staticVar';
import configs from '~/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDelete } from '../redux/deleteStateSlice';
import { setSort } from '../redux/filterState';

const cx = classNames.bind(styles);

let SortBtn = ({ sort_by, sort_order, children }) => {
    let dispatch = useDispatch();
    let handleSortState = () => {
        dispatch(
            setSort({
                sort_by: sort_by.toLowerCase(),
                sort_order: sort_order.toLowerCase(),
            }),
        );
    };
    return (
        <div className={cx('sort-btn')} onClick={handleSortState}>
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

let checkRoute = (location) => {
    switch (location) {
        case configs.mainRoutes.doctor + configs.doctorRoutes.covidPatient:
            return true;
        case configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem:
            return true;
        case configs.mainRoutes.doctor + configs.doctorRoutes.essentialPackage:
            return true;
        case configs.mainRoutes.doctor + configs.doctorRoutes.paymentManagement:
            return true;
        case configs.mainRoutes.doctor + configs.doctorRoutes.statistics:
            return true;
        default:
            return false;
    }
};

function Header() {
    let location = useLocation();
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let deleteState = useSelector((state) => state.deleteState);
    //let [urlSearch, setUrlSearch] = useState('');
    let [paramHeader, setParamHeader] = useState({});

    let [showHeader, setShowHeader] = useState();
    useEffect(() => {
        if (checkRoute(location.pathname)) {
            setShowHeader(true);
        } else {
            setShowHeader(false);
        }
    }, [location.pathname]);

    let getDataField = useCallback((location) => {
        let addLink = '';
        let filterItem, sortItem;
        switch (location) {
            case configs.mainRoutes.doctor + configs.doctorRoutes.covidPatient:
                [filterItem, sortItem] = getFilterSortMenu(patientSortFilter);
                addLink =
                    configs.mainRoutes.doctor + configs.doctorRoutes.covidPatient + configs.doctorRoutes.newPatient;
                return { filterItem, sortItem, addLink };

            case configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem:
                [filterItem, sortItem] = getFilterSortMenu(necessityFields);
                addLink =
                    configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem + configs.doctorRoutes.newNecessity;
                return { filterItem, sortItem, addLink };
            case configs.mainRoutes.doctor + configs.doctorRoutes.essentialPackage:
                [filterItem, sortItem] = getFilterSortMenu(essentialPackageFields);
                addLink =
                    configs.mainRoutes.doctor + configs.doctorRoutes.essentialPackage + configs.doctorRoutes.newPackage;
                return { filterItem, sortItem, addLink };
            default:
                return {};
        }
    });

    let handleBack = () => {
        navigate(-1, { replace: true });
    };

    useEffect(() => {
        setParamHeader(getDataField(location.pathname));
    }, [location.pathname]);

    return (
        <HeaderLayout>
            {!showHeader && <TaskBtn title="Back" to={paramHeader.addLink || ''} onClick={handleBack} />}
            {showHeader && (
                <>
                    <TaskBtn
                        title="Add"
                        to={paramHeader.addLink || ''}
                        onClick={() => setShowHeader(false)}
                        icon={<PlusIcon />}
                    />
                    <div className={cx('list_btn')}>
                        <TaskBtn
                            title="Delete"
                            active={deleteState.state}
                            onClick={() => dispatch(setDelete(!deleteState.state))}
                        />
                        <Menu menu={paramHeader.filterItem || []}>
                            <TaskBtn title="Filter" />
                        </Menu>
                        <Menu menu={paramHeader.sortItem || []}>
                            <TaskBtn title="Sort" />
                        </Menu>
                        <SearchInput stateDynamique={true} icon={<SearchIcon />} />
                    </div>
                </>
            )}
        </HeaderLayout>
    );
}

export default Header;
