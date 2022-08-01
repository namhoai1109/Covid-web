import classNames from 'classnames/bind';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './FacilityPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import ListItem from '~/CommonComponent/ListItem';
import { removeFacility } from '../redux/listFacilitySlice';
import { menuFacility } from '../staticVar';
import { useEffect } from 'react';
import { getListFacility } from '../fetchAPI';
import { deleteAPI } from '~/APIservices/deleteAPI';

const cx = classNames.bind(styles);

function FacilityPage() {
    let dispatch = useDispatch();
    useEffect(() => {
        getListFacility(dispatch);
    }, []);

    let deleteState = useSelector((state) => state.delete);
    let listFacility = useSelector((state) => state.listFacility.listFacility);
    //console.log(listFacility);

    let handleDeleteFacility = async (id) => {
        try {
            let res = await deleteAPI('facility/delete/id=' + id);
            if (res.message && res.message === 'Facility deleted successfully') {
                getListFacility(dispatch);
            }
        } catch (err) {
            console.log(err);
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
                    };

                    return (
                        <ListItem
                            key={index}
                            infos={nItem}
                            showDelete={deleteState.isShow}
                            clickDelete={() => handleDeleteFacility(item._id)}
                        />
                    );
                })}
            </WrapContent>
        </div>
    );
}

export default FacilityPage;
