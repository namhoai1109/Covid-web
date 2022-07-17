import classNames from 'classnames/bind';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './CovidPatient.module.scss';
import { patientFields } from '../staticVar';
import { getAPI } from '~/APIservices/getAPI';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPatient, clearList, deletePatient } from '../redux/listPatientSlice';
import ListItem from '~/CommonComponent/ListItem';

const cx = classNames.bind(styles);

function CovidPatient() {
    let dispatch = useDispatch();

    let getListPatient = async () => {
        try {
            let listPatient = await getAPI('/doctor/patients');
            dispatch(clearList());
            listPatient.forEach((patient) => {
                dispatch(addPatient(patient));
            });
            // return listPatient;
        } catch (err) {
            console.log(err);
            // return err;
        }
    };

    let handleDeletePatient = (index) => {
        dispatch(deletePatient(index));
    };

    let formatList = (list) => {
        let newList = list.map((item) => {
            return {
                id: item.id_number,
                name: item.name,
                YoB: item.DOB.split('-')[0],
                status: item.status,
                facility: '',
            };
        });
        return newList;
    };

    useEffect(() => {
        getListPatient();
    }, []);

    let listPatient = useSelector((state) => state.listPatient);
    let deleteState = useSelector((state) => state.deleteState);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('row', 'z1', 'list-item')}>
                {patientFields.map((field, index) => {
                    return (
                        <div className={cx('col2-4', 'item')} key={index}>
                            {field}
                        </div>
                    );
                })}
            </div>
            <WrapContent>
                {formatList(listPatient).map((patient, index) => {
                    return (
                        <ListItem
                            key={index}
                            infos={patient}
                            showDelete={deleteState.state}
                            clickDelete={() => handleDeletePatient(index)}
                        />
                    );
                })}
            </WrapContent>
        </div>
    );
}

export default CovidPatient;
