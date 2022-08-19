import classNames from 'classnames/bind';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './CovidPatient.module.scss';
import { Status } from '../staticVar';
import { useCallback, useEffect, useState } from 'react';
import { PlusIcon } from '~/CommonComponent/icons';
import { useDispatch, useSelector } from 'react-redux';
import ListPatient from './ListPatient';
import ListItem from '~/CommonComponent/ListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { add, deleteItem, reset } from '../redux/currentCloseContactList';
import { putAPI } from '~/APIservices/putAPI';
import { getAPI } from '~/APIservices/getAPI';
import SelectOption from '~/CommonComponent/SelectOption';

const cx = classNames.bind(styles);

function InfoPatient() {
    let formatItem = useCallback((item) => {
        return {
            id_number: item.id_number,
            name: item.name,
            dob: item.dob.split('-')[0],
            status: item.status,
            facility: (item.current_facility && item.current_facility.name) || '',
        };
    }, []);

    let [showList, setShowList] = useState(false);
    let [updateMode, setUpdateMode] = useState(false);
    let dispatch = useDispatch();
    let closeContactList = useSelector((state) => state.currentCloseContactList.list);
    let patient = useSelector((state) => state.listPatient.currentPatient);
    //console.log(patient);
    let [status, setStatus] = useState(patient.status || '');
    let [facility, setFacility] = useState(
        (patient.current_facility && patient.current_facility.name) || 'no facility',
    );

    let [listFacility, setListFacility] = useState({
        first: [],
        sec: [],
    });
    console.log(listFacility.first);
    let getListFacility = useCallback(async () => {
        let list = await getAPI('doctor/facilities');

        let tmp = [];
        list.forEach((item) => {
            let str = item.name + '-' + item.location.province;
            tmp.push(str);
        });

        setListFacility({ first: list, sec: tmp });
    }, []);

    let fetchUpdatePatient = useCallback(async (data) => {
        try {
            let res = await putAPI('/doctor/patients/id=' + patient._id, data);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }, []);

    let handleUpdateMode = useCallback(() => {
        let id_facility = '';
        listFacility.first.forEach((item) => {
            if (item.name === facility.split('-')[0]) {
                id_facility = item._id;
            }
        });
        if (updateMode) {
            let formUpdate = {
                status: status,
                current_facility: id_facility,
                close_contact_list: closeContactList.map((item) => item._id),
            };
            fetchUpdatePatient(formUpdate);
        }
        setUpdateMode(!updateMode);
    }, []);

    useEffect(() => {
        if (patient.close_contact_list) {
            patient.close_contact_list.map((item) => {
                dispatch(add(item));
            });
        }
        getListFacility();
        return () => {
            dispatch(reset());
        };
    }, []);

    return (
        <div className={cx('wrapper')}>
            {showList ? (
                <ListPatient onBack={() => setShowList(!showList)} />
            ) : (
                <WrapContent>
                    <div onClick={handleUpdateMode} className={cx('submit-btn', 'flex-center')}>
                        {updateMode ? (
                            <FontAwesomeIcon icon={faCheck} className={cx('check-icon')} />
                        ) : (
                            <FontAwesomeIcon icon={faPenToSquare} className={cx('update-icon')} />
                        )}
                    </div>
                    {updateMode && (
                        <div className={cx('row')}>
                            <div className={cx('col12', 'field-info', 'flex-center')}>
                                <span className={cx('label')}>Now you can update the information</span>
                            </div>
                        </div>
                    )}
                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col2', 'field-info')}>
                            <span className={cx('label')}>ID number:</span>
                            <span>{patient.id_number || ''}</span>
                        </div>
                        <div className={cx('col2', 'field-info')}>
                            <span className={cx('label')}>Name:</span>
                            <span>{patient.name || ''}</span>
                        </div>
                        <div className={cx('col2', 'field-info')}>
                            <span className={cx('label')}>Year of birth:</span>
                            <span>{patient.dob && patient.dob.split('-')[0]}</span>
                        </div>
                    </div>

                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col4', 'field-info')}>
                            <span className={cx('label')}>Address:</span>
                            <span>{patient.address || ''}</span>
                        </div>
                    </div>
                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col2-4', 'field-info', 'flex-center')}>
                            <span className={cx('label')}>Facility:</span>
                            {/* <span>{(patient.current_facility && patient.current_facility.name) || ''}</span> */}
                            <SelectOption
                                readOnly={!updateMode}
                                options={listFacility.sec}
                                value={facility}
                                onChange={(val) => setFacility(val)}
                            />
                        </div>
                    </div>

                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col2-4', 'field-info')}>
                            <span className={cx('label')}>Status</span>
                            {Status.map((title, index) => {
                                return (
                                    <label
                                        key={index}
                                        className={cx('radio', {
                                            disabled: !updateMode,
                                        })}
                                    >
                                        <input
                                            type="radio"
                                            name="state"
                                            value={title}
                                            checked={status === title}
                                            onChange={() => setStatus(title)}
                                        />
                                        <span className={cx('title-radio')}>{title}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col2', 'flex-center')}>
                            <span className={cx('label', 'close-contact-label')}>Close contact list</span>
                            <div
                                onClick={() => setShowList(!showList)}
                                className={cx('btn', 'flex-center', {
                                    disabled: !updateMode,
                                })}
                            >
                                <PlusIcon width="2rem" height="2rem" />
                            </div>
                        </div>
                        <div className={cx('contact-list')}>
                            {closeContactList.map((patient, index) => {
                                let item = formatItem(patient);
                                return (
                                    <ListItem
                                        key={index}
                                        infos={item}
                                        showDelete={updateMode}
                                        clickDelete={() => dispatch(deleteItem(index))}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </WrapContent>
            )}
        </div>
    );
}

export default InfoPatient;
