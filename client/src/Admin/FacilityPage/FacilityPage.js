import classNames from 'classnames/bind';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './FacilityPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import ListItem from '~/CommonComponent/ListItem';
import { formUpdateFacility, menuFacility } from '../staticVar';
import { useCallback, useEffect, useState } from 'react';
import { getListFacility } from '../fetchAPI';
import { deleteAPI } from '~/APIservices/deleteAPI';
import TippyHeadless from '@tippyjs/react/headless';
import { putAPI } from '~/APIservices/putAPI';
import { setMess } from '../redux/messNoti';

const cx = classNames.bind(styles);

let EditScreen = ({ menu, item, children }) => {
    let [validate, setValidate] = useState('');
    let dispatch = useDispatch();
    let [inputVals, setInputVals] = useState({
        name: item.name,
        capacity: item.capacity,
    });
    let handleSubmit = useCallback(async () => {
        console.log(inputVals);
        let res = await putAPI('facility/update/id=' + item._id, inputVals);
        console.log(res.message);
        if (res.message && res.message.includes('failed')) {
            setValidate('Value is not valid');
        } else if (res.message && res.message === 'Facility updated successfully') {
            getListFacility(dispatch);
            dispatch(setMess({ mess: 'Update successfully', type: 'success' }));
        }
    }, [inputVals]);

    let handleChange = useCallback(
        (e, title) => {
            let val = e.target.value;
            setInputVals({ ...inputVals, [title]: val });
            setValidate('');
        },
        [inputVals],
    );

    let renderItem = (attrs) => (
        <div tabIndex="-1" {...attrs}>
            <div className={cx('wrap-update-form')}>
                <button onClick={handleSubmit} className={cx('submit-btn')}>
                    Save
                </button>
                <span className={cx('noti')}>{validate}</span>
                <div className={cx('flex-center')}>
                    <div>
                        {menu.map((item, index) => (
                            <div key={index} className={cx('item')}>
                                <span className={cx('title')}>{item.title}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        {menu.map((item, index) => {
                            let nTitle = item.title.toLowerCase();
                            return (
                                <div key={index} className={cx('item')}>
                                    <input
                                        className={cx('input')}
                                        type={item.type === 'number' ? item.type : 'text'}
                                        value={inputVals[nTitle]}
                                        onChange={(e) => handleChange(e, nTitle)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <TippyHeadless interactive placement="bottom-start" render={renderItem} trigger="click">
                {children}
            </TippyHeadless>
        </div>
    );
};

function FacilityPage() {
    let dispatch = useDispatch();
    useEffect(() => {
        getListFacility(dispatch);
    }, []);

    let deleteState = useSelector((state) => state.delete);
    let listFacility = useSelector((state) => state.listFacility.listFacility);
    //console.log(listFacility);

    let handleDeleteFacility = async (id, current_count) => {
        if (current_count === 0) {
            try {
                let res = await deleteAPI('facility/delete/id=' + id);
                if (res.message && res.message === 'Facility deleted successfully') {
                    getListFacility(dispatch);
                    dispatch(setMess({ mess: 'Delete successfully', type: 'success' }));
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            dispatch(setMess({ mess: 'Can not delete', type: 'error' }));
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('row', 'list-item', 'z1')}>
                {menuFacility.map((title, index) => {
                    return (
                        <div key={index} className={cx('col2-4', 'item')}>
                            {title}
                        </div>
                    );
                })}
            </div>
            <WrapContent>
                {listFacility.map((item, index) => {
                    let nItem = {
                        name: item.name,
                        capacity: item.capacity,
                        current_count: item.current_count,
                        ignore: '',
                        edit: (
                            <EditScreen item={item} menu={formUpdateFacility}>
                                <button className={cx('edit-btn')}>Edit</button>
                            </EditScreen>
                        ),
                    };

                    return (
                        <ListItem
                            key={index}
                            infos={nItem}
                            showDelete={deleteState.isShow}
                            clickDelete={() => handleDeleteFacility(item._id, item.current_count)}
                        />
                    );
                })}
            </WrapContent>
        </div>
    );
}

export default FacilityPage;
