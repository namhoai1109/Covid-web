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

const cx = classNames.bind(styles);

function InfoPatient() {
    let formatItem = useCallback((item) => {
        return {
            id: item.id_number,
            name: item.name,
            YoB: item.DOB.split('-')[0],
            status: item.status,
            facility: '',
        };
    });

    let [showList, setShowList] = useState(false);
    let [updateMode, setUpdateMode] = useState(false);
    let dispatch = useDispatch();
    let closeContactList = useSelector((state) => state.currentCloseContactList.list);
    let patient = useSelector((state) => state.listPatient.currentPatient);
    let [status, setStatus] = useState(patient.status || '');

    let fetchUpdatePatient = async (data) => {
        try {
            let res = await putAPI('/doctor/patients/id=' + patient._id, data);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    let handleUpdateMode = () => {
        if (updateMode) {
            let formUpdate = {
                status: status,
                current_facility: '',
                close_contact_list: closeContactList.map((item) => item._id),
            };
            fetchUpdatePatient(formUpdate);
        }
        setUpdateMode(!updateMode);
    };

    useEffect(() => {
        if (patient.close_contact_list) {
            patient.close_contact_list.map((item) => {
                dispatch(add(item));
            });
        }

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
                                <span className={cx('label')}>Now you can update information</span>
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
                            <span>{patient.DOB && patient.DOB.split('-')[0]}</span>
                        </div>
                    </div>

                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col3', 'field-info')}>
                            <span className={cx('label')}>Address:</span>
                            <span>{patient.address || ''}</span>
                        </div>
                    </div>
                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col2', 'field-info')}>
                            <span className={cx('label')}>Facility:</span>
                            <span>{}</span>
                        </div>
                    </div>

                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col2-4', 'field-info')}>
                            <span className={cx('label')}>Status</span>
                            {Status.map((title, index) => {
                                let stateDefault = patient.status && patient.status === title;
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
