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
import { faArrowDownWideShort, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { deleteFilter, deleteSort } from '../redux/filterState';
import { filterAPI } from '~/APIservices/filterAPI';
import { searchAPI } from '~/APIservices/searchAPI';
import { sortAPI } from '~/APIservices/sortAPI';

const cx = classNames.bind(styles);

let FilterBtn = ({ onClick }) => {
    return (
        <div onClick={onClick} className={cx('wrap-filter-sort-btn')}>
            <FontAwesomeIcon icon={faFilterCircleXmark} />
        </div>
    );
};

let SortBtn = ({ onClick }) => {
    return (
        <div onClick={onClick} className={cx('wrap-filter-sort-btn')}>
            <FontAwesomeIcon icon={faArrowDownWideShort} />
        </div>
    );
};

function CovidPatient() {
    let dispatch = useDispatch();
    let navigate = useNavigate();

    let getListPatient = async () => {
        try {
            let listPatient = await getAPI('/doctor/patients');
            //console.log(listPatient);
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

    let getListFilter = async () => {
        let res = await filterAPI('doctor/patients/filter', valueFilter);
        dispatch(setListPatient(res));
    };

    let getListSearch = async (value) => {
        let res = await searchAPI('doctor/patients/search', value);
        dispatch(setListPatient(res));
    };

    let getListSort = async (sortParam) => {
        let res = await sortAPI('doctor/patients', sortParam);
        console.log(res);
        dispatch(setListPatient(res));
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
            dob: item.dob.split('-')[0],
            status: item.status,
            facility: item.current_facility.name,
        };
    });

    let listPatient = useSelector((state) => state.listPatient.list);
    let filterState = useSelector((state) => state.filterState.filter);
    let valueFilter = useSelector((state) => state.filterState.valueFilter);
    let searchValue = useSelector((state) => state.filterState.search);
    let sortParam = useSelector((state) => state.filterState.sort);
    let deleteState = useSelector((state) => state.deleteState);

    useEffect(() => {
        getListPatient();
    }, []);

    useEffect(() => {
        if (filterState.length !== 0) {
            getListFilter();
        }

        if (searchValue !== '') {
            getListSearch(searchValue);
        }

        if (sortParam.sort_by) {
            getListSort(sortParam);
        }

        if (filterState.length === 0 && searchValue === '' && !sortParam.sort_by) {
            getListPatient();
        }
    }, [valueFilter, filterState, searchValue, sortParam]);

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
                            {sortParam.sort_by === field.toLowerCase() && (
                                <SortBtn onClick={() => dispatch(deleteSort())} />
                            )}
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
