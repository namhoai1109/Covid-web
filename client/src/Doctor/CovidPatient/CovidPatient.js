import classNames from 'classnames/bind';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './CovidPatient.module.scss';
import { patientFields } from '../staticVar';
import { getAPI } from '~/APIservices/getAPI';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCurrentPatient, setListPatient } from '../redux/listPatientSlice';
import ListItem from '~/CommonComponent/ListItem';
import { deleteAPI } from '~/APIservices/deleteAPI';
import { useNavigate } from 'react-router-dom';
import configs from '~/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { deleteFilter } from '../redux/filterState';

const cx = classNames.bind(styles);

let FilterBtn = ({ onClick }) => {
    return (
        <div onClick={onClick} className={cx('wrap-filter-btn')}>
            <FontAwesomeIcon icon={faFilterCircleXmark} />
        </div>
    );
};

function CovidPatient() {
    let dispatch = useDispatch();
    let navigate = useNavigate();

    let getListPatient = async () => {
        try {
            let listPatient = await getAPI('/doctor/patients');
            console.log(listPatient);
            if (listPatient.message === 'timeout of 5000ms exceeded') {
                listPatient = [];
            }
            dispatch(setListPatient(listPatient));
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
    let filterState = useSelector((state) => state.filterState.filter);
    let deleteState = useSelector((state) => state.deleteState);

    useEffect(() => {
        if (filterState.length === 0) {
            getListPatient();
        }
    }, [filterState]);

    let checkinFilter = (item) => {
        let isExist = false;
        filterState.forEach((filter) => {
            if (filter === item) {
                isExist = true;
            }
        });

        return isExist;
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('row', 'z1', 'list-item')}>
                {patientFields.map((field, index) => {
                    return (
                        <div className={cx('col2-4', 'item', 'flex-center')} key={index}>
                            {field}
                            {checkinFilter(field) && <FilterBtn onClick={() => dispatch(deleteFilter(field))} />}
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
