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
import { addFacility } from '../redux/listFacilitySlice';
import { postAPI } from '~/APIservices/postAPI';
import { menuFacility, menuManager, formInputDoctor, formInputFacility } from '../staticVar';
import { getListFacility, initListManager } from '../fetchAPI';
import { useState } from 'react';
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
        return res;
    } catch (error) {
        return error;
    }
};

function Header() {
    let location = useLocation();
    let dispatch = useDispatch();
    let deleteState = useSelector((state) => state.delete.isShow);
    let [validate, setValidate] = useState('');
    let [filterItem, sortItem] = getFilterSortMenu(
        location.pathname === configs.mainRoutes.admin + configs.adminRoutes.doctorManagement
            ? menuManager
            : menuFacility,
    );

    let handleClick = async (inputVals) => {
        if (location.pathname === configs.mainRoutes.admin + configs.adminRoutes.doctorManagement) {
            let readySubmit = true;
            let clearInput = false;
            if (inputVals.username === '' || inputVals.password === '') {
                setValidate('Username, password are required');
                readySubmit = false;
            } else if (inputVals.name !== '') {
                if (/^[a-zA-Z ]{1,50}$/.test(inputVals.name) === false) {
                    setValidate('Name is invalid');
                    readySubmit = false;
                }
            }

            if (readySubmit) {
                let res = await registerManager({
                    username: inputVals.username,
                    password: inputVals.password,
                    name: inputVals.name,
                });

                console.log(res);
                if (typeof res === 'string' && res.includes('duplicate')) {
                    setValidate('Username is already exist');
                } else if (res.message === 'Account created successfully') {
                    clearInput = true;
                    initListManager(dispatch);
                }
            }

            return clearInput;
        } else {
            console.log(inputVals);
            let clearInput = false;
            let readySubmit = true;

            Object.keys(inputVals).forEach((key) => {
                if (inputVals[key] === '' || inputVals[key] === '--select--') {
                    setValidate(`These fields are required`);
                    readySubmit = false;
                }
            });

            if (inputVals.capacity !== '') {
                if (inputVals.capacity <= 0) {
                    setValidate('Capacity is invalid');
                    readySubmit = false;
                }
            }

            if (readySubmit) {
                let body = {
                    name: inputVals.name,
                    capacity: Number(inputVals.capacity),
                    province: inputVals['province/city'],
                    district: inputVals['district/county'],
                    ward: inputVals['ward/village'],
                };

                let token = JSON.parse(localStorage.getItem('Token')).token;
                let res = await postAPI('facility/create', body, token);
                console.log(res);
                if (typeof res === 'string' && res.includes('duplicate')) {
                    setValidate('Username is already exist');
                } else if (res.message && res.message === 'Facility created successfully') {
                    getListFacility(dispatch);
                    clearInput = true;
                }
            }
            return clearInput;
        }
    };

    return (
        <HeaderLayout>
            <MenuFormInput
                validateStr={validate}
                setValidateStr={setValidate}
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
