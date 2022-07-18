import classNames from 'classnames/bind';
import styles from './CovidPatient.module.scss';
import WrapContent from '~/CommonComponent/WrapContent';
import ListItem from '~/CommonComponent/ListItem';
import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import { add } from '../redux/currentCloseContactList';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles);

function ListPatient({ onBack }) {
    let [listPatient, setListPatient] = useState([]);
    let dispatch = useDispatch();

    let getListPatient = async () => {
        try {
            let listPatient = await getAPI('/doctor/patients');
            setListPatient(listPatient);
            // return listPatient;
        } catch (err) {
            console.log(err);
            // return err;
        }
    };

    useEffect(() => {
        getListPatient();
    }, []);

    let formatItem = useCallback((item) => {
        return {
            id: item.id_number,
            name: item.name,
            YoB: item.DOB.split('-')[0],
            status: item.status,
            facility: '',
        };
    });

    let handleClick = (patient) => {
        dispatch(add(patient));
        onBack();
    };

    return (
        <div className={cx('wrap-list')}>
            <WrapContent>
                {listPatient.map((patient, index) => {
                    let fPatient = formatItem(patient);
                    return (
                        <div key={index} onClick={() => handleClick(patient)} className={cx('wrap-item-patient')}>
                            <ListItem infos={fPatient} />
                        </div>
                    );
                })}
            </WrapContent>
        </div>
    );
}

export default ListPatient;
