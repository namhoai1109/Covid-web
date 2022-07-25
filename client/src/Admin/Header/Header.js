import HeaderLayout from '~/Layout/Header';
import TaskBtn from '~/CommonComponent/TaskBtn';
import { PlusIcon, SearchIcon } from '~/CommonComponent/icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import SearchInput from '~/CommonComponent/SearchInput';
import { Menu, MenuFormInput } from '~/CommonComponent/Popper';
import { useLocation } from 'react-router-dom';
import configs from '~/config';
import { useDispatch, useSelector } from 'react-redux';
import { setDelete } from '../redux/deleteSlice';
import { addManager } from '../redux/listManagerSlice';
import { addFacility } from '../redux/listFacilitySlice';
import { postAPI } from '~/APIservices/postAPI';
import { menuFacility, menuManager, formInputDoctor, formInputFacility } from '../staticVar';
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

let registerManager = async (data) => {
    try {
        let token = JSON.parse(localStorage.getItem('Token')).token;
        let res = await postAPI('admin/register', data, token);
        console.log(res);
    } catch (error) {
        console.log(error);
    }
};

function Header() {
    let location = useLocation();
    let dispatch = useDispatch();
    let deleteState = useSelector((state) => state.delete.isShow);

    let [filterItem, sortItem] = getFilterSortMenu(
        location.pathname === configs.mainRoutes.admin + configs.adminRoutes.doctorManagement
            ? menuManager
            : menuFacility,
    );

    let handleClick = async (inputVals) => {
        if (location.pathname === configs.mainRoutes.admin + configs.adminRoutes.doctorManagement) {
            await registerManager({
                username: inputVals.id,
                password: inputVals.password,
                name: inputVals.username,
            });
            inputVals.status = 'active';
            if (!inputVals.username) {
                inputVals.username = 'Anonymous';
            }
            console.log(inputVals);
            dispatch(addManager(inputVals));
        } else {
            console.log(inputVals);
            let nInputVals = {
                name: inputVals['name'],
                ['max no. patient']: inputVals['max no. patient'],
                noPatient: 0,
            };
            dispatch(addFacility(nInputVals));
        }
    };

    return (
        <HeaderLayout>
            <MenuFormInput
                onClick={handleClick}
                menu={
                    location.pathname === configs.mainRoutes.admin + configs.adminRoutes.doctorManagement
                        ? formInputDoctor
                        : formInputFacility
                }
            >
                <TaskBtn title="Add" icon={<PlusIcon />} />
            </MenuFormInput>
            <div className={cx('list_btn')}>
                <TaskBtn
                    title="Delete"
                    active={deleteState}
                    onClick={() => {
                        dispatch(setDelete(!deleteState));
                    }}
                />
                <Menu menu={filterItem}>
                    <TaskBtn title="Filter" />
                </Menu>
                <Menu menu={sortItem}>
                    <TaskBtn title="Sort" />
                </Menu>
                <SearchInput stateDynamique={true} icon={<SearchIcon />} />
            </div>
        </HeaderLayout>
    );
}

export default Header;
