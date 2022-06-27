import HeaderLayout from '~/Layout/Header';
import TaskBtn from '~/CommonComponent/TaskBtn';
import { PlusIcon, SearchIcon } from '~/CommonComponent/icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import SearchInput from '~/CommonComponent/SearchInput';
import { Menu, MenuFormInput } from '~/CommonComponent/Popper';
import { useLocation } from 'react-router-dom';
import configs from '~/config';

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

const formInputDoctor = ['ID: ', 'Name: ', 'Year of Birth: '];
const formInputFacility = ['Name: ', 'Max No. Patient: '];

function Header() {
    let location = useLocation();

    let [filterItem, sortItem] = getFilterSortMenu(
        location.pathname === configs.mainRoutes.admin + configs.adminRoutes.doctorManagement
            ? menuManager
            : menuFacility,
    );

    return (
        <HeaderLayout>
            <MenuFormInput
                menu={
                    location.pathname === configs.mainRoutes.admin + configs.adminRoutes.doctorManagement
                        ? formInputDoctor
                        : formInputFacility
                }
            >
                <TaskBtn title="Add" icon={<PlusIcon />} />
            </MenuFormInput>
            <div className={cx('list_btn')}>
                <TaskBtn title="Delete" />
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
