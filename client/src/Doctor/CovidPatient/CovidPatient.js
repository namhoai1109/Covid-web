import classNames from 'classnames/bind';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './CovidPatient.module.scss';
import { patientFields } from '../staticVar';
import { getAPI } from '~/APIservices/getAPI';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPatient, clearList, deletePatient, addCurrentPatient } from '../redux/listPatientSlice';
import ListItem from '~/CommonComponent/ListItem';
import { deleteAPI } from '~/APIservices/deleteAPI';
import { useNavigate } from 'react-router-dom';
import configs from '~/config';

const cx = classNames.bind(styles);

function CovidPatient() {
    let dispatch = useDispatch();
    let navigate = useNavigate();

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

    let fetchDeletePatient = async (id) => {
        try {
            let res = await deleteAPI('/doctor/patients/id=' + id);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    let handleDeletePatient = (index, id) => {
        fetchDeletePatient(id).then(() => {
            getListPatient();
        });
    };

    let handleInfoPatient = (patient) => {
        navigate(configs.mainRoutes.doctor + configs.doctorRoutes.covidPatient + configs.doctorRoutes.infoPatient);
        dispatch(addCurrentPatient(patient));
    };

    let formatItem = useCallback((item) => {
        return {
            id: item.id_number,
            name: item.name,
            YoB: item.DOB.split('-')[0],
            status: item.status,
            facility: '',
        };
    });

    useEffect(() => {
        getListPatient();
    }, []);

    let listPatient = useSelector((state) => state.listPatient.list);
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
                {listPatient.map((patient, index) => {
                    let nPatient = formatItem(patient);
                    let idDelete = patient._id;
                    return (
                        <div
                            onClick={deleteState.state ? () => {} : () => handleInfoPatient(patient)}
                            key={index}
                            className={cx('wrap-list-item', {
                                disabled: deleteState.state,
                            })}
                        >
                            <ListItem
                                infos={nPatient}
                                showDelete={deleteState.state}
                                clickDelete={() => handleDeletePatient(index, idDelete)}
                            />
                        </div>
                    );
                })}
            </WrapContent>
        </div>
    );
}

export default CovidPatient;
