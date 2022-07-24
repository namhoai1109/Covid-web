import HeaderLayout from '~/Layout/Header';
import TaskBtn from '~/CommonComponent/TaskBtn';
import { PlusIcon, SearchIcon } from '~/CommonComponent/icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import SearchInput from '~/CommonComponent/SearchInput';
import { Menu } from '~/CommonComponent/Popper';
import { patientFields, necessityFields } from '../staticVar';
import configs from '~/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDelete } from '../redux/deleteStateSlice';

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

    let [showHeader, setShowHeader] = useState();
    useEffect(() => {
        if (checkRoute(location.pathname)) {
            setShowHeader(true);
        } else {
            setShowHeader(false);
        }
    }, [location.pathname]);

    let getDataField = (location) => {
        let addLink = '';
        let filterItem, sortItem;
        switch (location) {
            case configs.mainRoutes.doctor + configs.doctorRoutes.covidPatient:
                [filterItem, sortItem] = getFilterSortMenu(patientFields);
                addLink =
                    configs.mainRoutes.doctor + configs.doctorRoutes.covidPatient + configs.doctorRoutes.newPatient;
                return { filterItem, sortItem, addLink };

            case configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem:
                [filterItem, sortItem] = getFilterSortMenu(necessityFields);
                addLink =
                    configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem + configs.doctorRoutes.newNecessity;
                return { filterItem, sortItem, addLink };
            default:
                return {};
        }
    };

    let handleBack = () => {
        navigate(-1, { replace: true });
    };

    let { filterItem, sortItem, addLink } = getDataField(location.pathname);

    return (
        <HeaderLayout>
            {!showHeader && <TaskBtn title="Back" to={addLink || ''} onClick={handleBack} />}
            {showHeader && (
                <>
                    <TaskBtn title="Add" to={addLink || ''} onClick={() => setShowHeader(false)} icon={<PlusIcon />} />
                    <div className={cx('list_btn')}>
                        <TaskBtn
                            title="Delete"
                            active={deleteState.state}
                            onClick={() => dispatch(setDelete(!deleteState.state))}
                        />
                        <Menu menu={filterItem || []}>
                            <TaskBtn title="Filter" />
                        </Menu>
                        <Menu menu={sortItem || []}>
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
