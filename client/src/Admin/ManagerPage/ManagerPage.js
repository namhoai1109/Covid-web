import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import ListItem from '~/CommonComponent/ListItem';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './ManagerPage.module.scss';
import { removeManager } from '../redux/listManagerSlice';
import { Link } from 'react-router-dom';
import { getAPI } from '~/APIservices/getAPI';
import { addManager, clearList, setStatus } from '../redux/listManagerSlice';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function ManagerPage() {
    let dispatch = useDispatch();

    let initListManager = async () => {
        try {
            let doctors = await getAPI('admin/doctors');
            dispatch(clearList());
            doctors.forEach((doctor) => {
                if (doctor.id_number !== null || doctor.account !== null) {
                    dispatch(
                        addManager({
                            id: doctor.id_number,
                            username: doctor.name,
                            status: doctor.account.status,
                        }),
                    );
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    let formatList = (list) => {
        let handleInactive = (index) => {
            dispatch(
                setStatus({
                    index,
                    status: list[index].status === 'active' ? 'inactive' : 'active',
                }),
            );
        };

        let newList = list.map((item, index) => {
            return {
                id_number: (
                    <span
                        className={cx({
                            inactive: item.status === 'inactive',
                        })}
                    >
                        {item.id}
                    </span>
                ),
                username: (
                    <span
                        className={cx({
                            inactive: item.status === 'inactive',
                        })}
                    >
                        {item.username}
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
                        inactive
                    </div>
                ),
            };
        });

        return newList;
    };

    useEffect(() => {
        initListManager();
    }, []);

    let deleteState = useSelector((state) => state.delete);
    let listManager = useSelector((state) => state.listManager);
    let newList = formatList(listManager);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('row', 'list-item', 'z1')}>
                <div className={cx('col2-4', 'item')}>ID</div>
                <div className={cx('col2-4', 'item')}>Username</div>
            </div>
            <WrapContent>
                {newList.map((item, index) => {
                    return (
                        <ListItem
                            key={index}
                            infos={item}
                            showDelete={deleteState.isShow}
                            clickDelete={() => {
                                dispatch(removeManager(index));
                            }}
                        />
                    );
                })}
            </WrapContent>
        </div>
    );
}

export default ManagerPage;
