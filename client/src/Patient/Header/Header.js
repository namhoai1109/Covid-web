import HeaderLayout from '~/Layout/Header';
import TaskBtn from '~/CommonComponent/TaskBtn';
import { PlusIcon, SearchIcon } from '~/CommonComponent/icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import SearchInput from '~/CommonComponent/SearchInput';
import { Menu } from '~/CommonComponent/Popper';
import { useLocation } from 'react-router-dom';

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

function Header() {
    // let location = useLocation();

    return (
        <HeaderLayout>
            <TaskBtn title="F0" disabled />
            <div className={cx('list_btn')}>
                <Menu menu={[]}>
                    <TaskBtn title="Filter" />
                </Menu>
                <Menu menu={[]}>
                    <TaskBtn title="Sort" />
                </Menu>
                <SearchInput stateDynamique={true} icon={<SearchIcon />} />
            </div>
        </HeaderLayout>
    );
}

export default Header;
