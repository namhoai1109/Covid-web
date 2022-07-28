import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import ListItem from '~/CommonComponent/ListItem';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './ManagerPage.module.scss';
import { removeManager } from '../redux/listManagerSlice';
import { Link } from 'react-router-dom';
import { setStatus } from '../redux/listManagerSlice';
import { useCallback, useEffect } from 'react';
import { menuManager } from '../staticVar';
import { deleteAPI } from '~/APIservices/deleteAPI';
import { initListManager } from '../fetchAPI';
import { putAPI } from '~/APIservices/putAPI';

const cx = classNames.bind(styles);

function ManagerPage() {
    let dispatch = useDispatch();

    let formatItem = useCallback((item, index) => {
        let handleInactive = async (index) => {
            let res = await putAPI(`admin/doctors/id=${item.id_account}/changestatus`, {
                status: item.status === 'active' ? 'inactive' : 'active',
            });
            if (res.message && res.message === 'Status changed successfully') {
                dispatch(
                    setStatus({
                        index,
                        status: item.status === 'active' ? 'inactive' : 'active',
                    }),
                );
            }
        };

        return {
            username: (
                <span
                    className={cx({
                        inactive: item.status === 'inactive',
                    })}
                >
                    {item.username}
                </span>
            ),
            name: (
                <span
                    className={cx({
                        inactive: item.status === 'inactive',
                    })}
                >
                    {item.name}
                </span>
            ),
            ig1: '',
            history: (
                <Link
                    className={cx('btn-item', {
                        inactive: item.status === 'inactive',
                    })}
                    to=""
                >
                    view history
                </Link>
            ),
            inactive: (
                <div onClick={() => handleInactive(index)} className={cx('btn-item')}>
                    {item.status === 'active' ? 'inactive' : 'active'}
                </div>
            ),
        };
    });

    let handleDeleteDoctor = async (infoDoctor, index) => {
        console.log(infoDoctor);

        let res = await deleteAPI(`admin/doctors/id=${infoDoctor._id}/delete`);
        console.log(res.message);
        if (res.message && res.message === 'Account deleted successfully') {
            dispatch(removeManager(index));
        }
    };

    useEffect(() => {
        initListManager(dispatch);
    }, []);

    let deleteState = useSelector((state) => state.delete);
    let listManager = useSelector((state) => state.listManager);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('row', 'list-item', 'z1')}>
                {menuManager.map((item, index) => {
                    return (
                        <div key={index} className={cx('col2-4', 'item')}>
                            {item}
                        </div>
                    );
                })}
            </div>
            <WrapContent>
                {listManager.map((item, index) => {
                    let nItem = formatItem(item, index);
                    return (
                        <ListItem
                            key={index}
                            infos={nItem}
                            showDelete={deleteState.isShow}
                            clickDelete={() => handleDeleteDoctor(item, index)}
                        />
                    );
                })}
            </WrapContent>
        </div>
    );
}

export default ManagerPage;
