import HeaderLayout from '~/Layout/Header';
import TaskBtn from '~/CommonComponent/TaskBtn';
import { PlusIcon, SearchIcon } from '~/CommonComponent/icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import SearchInput from '~/CommonComponent/SearchInput';
import { Menu } from '~/CommonComponent/Popper';
import { essentialPackageFields, patientSortFilter, necessitySortFilter, filterPrice } from '../staticVar';
import configs from '~/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDelete } from '../redux/deleteStateSlice';
import { addFilter, setSort, setValue } from '../redux/filterState';
import { ToastContainer, toast } from 'react-toastify';
import { clearMess } from '../redux/messNoti';

const cx = classNames.bind(styles);

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

let PriceBtn = ({ data, children }) => {
    let dispatch = useDispatch();
    let handleClick = () => {
        console.log(data);
        dispatch(addFilter('Price'));
        dispatch(setValue({ filter: 'Price', value: data }));
    };

    return (
        <div onClick={handleClick} className={cx('sub-btn')}>
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

let getFilterSortProduct = (menu) => {
    let [filterItem, sortItem] = getFilterSortMenu(menu);
    filterItem.forEach((item) => {
        if (item.data === 'Price') {
            item.child.data = filterPrice.map((price) => {
                return {
                    data: <PriceBtn data={price.value}>{price.interface}</PriceBtn>,
                };
            });
        }
    });
    sortItem.splice(2, 2);
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
        default:
            return false;
    }
};

let noBack = (location) => {
    switch (location) {
        case configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.covidPatient:
            return true;
        case configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.product:
            return true;
        case configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.package:
            return true;
        case configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.status:
            return true;
        case configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.payment:
            return true;
        case configs.mainRoutes.doctor + configs.doctorRoutes.paymentManagement:
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
    let [paramHeader, setParamHeader] = useState({});

    let [hideBack, setHideBack] = useState();
    let [showHeader, setShowHeader] = useState();

    let messNoti = useSelector((state) => state.messNoti);

    useEffect(() => {
        if (messNoti.mess !== '') {
            if (messNoti.type === 'success') {
                toast.success(messNoti.mess);
                dispatch(clearMess());
            } else if (messNoti.type === 'warn') {
                toast.warn(messNoti.mess);
                dispatch(clearMess());
            } else if (messNoti.type === 'error') {
                toast.error(messNoti.mess);
                dispatch(clearMess());
            }
        }
    }, [messNoti]);

    useEffect(() => {
        if (checkRoute(location.pathname)) {
            setShowHeader(true);
        } else {
            setShowHeader(false);
        }

        setHideBack(noBack(location.pathname));
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
                [filterItem, sortItem] = getFilterSortProduct(necessitySortFilter);
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
    }, []);

    let handleBack = () => {
        navigate(-1, { replace: true });
    };

    useEffect(() => {
        setParamHeader(getDataField(location.pathname));
    }, [location.pathname]);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <HeaderLayout>
                {!showHeader && !hideBack && <TaskBtn title="Back" onClick={handleBack} />}
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
        </>
    );
}

export default Header;
