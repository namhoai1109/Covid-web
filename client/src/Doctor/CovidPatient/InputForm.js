import classNames from 'classnames/bind';
import { FormInput } from '~/CommonComponent/Popper';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './CovidPatient.module.scss';
import { inputField1, inputField2, Status, dataAddress } from '../staticVar';
import { useCallback, useEffect, useState } from 'react';
import SelectOption from '~/CommonComponent/SelectOption';
import { PlusIcon } from '~/CommonComponent/icons';
import { useDispatch, useSelector } from 'react-redux';
import { postAPI } from '~/APIservices/postAPI';
import { reset, deleteItem } from '../redux/currentCloseContactList';
import ListItem from '~/CommonComponent/ListItem';
import ListPatient from './ListPatient';
import { getAPI } from '~/APIservices/getAPI';

const cx = classNames.bind(styles);

function InputForm() {
    let initDataInput = useCallback((menu) => {
        let data = {};
        for (let i = 0; i < menu.length; i++) {
            data[removeSpace(menu[i])] = '';
        }

        return data;
    });

    let initDataSelect = useCallback((menu, dataInit) => {
        let data = {};
        for (let i = 0; i < menu.length; i++) {
            data[menu[i].split('/')[0]] = dataInit;
        }
        return data;
    });

    let removeSpace = useCallback((title) => {
        return title.replaceAll(' ', '_');
    });

    let returnSpace = useCallback((title) => {
        return title.replaceAll('_', ' ');
    });

    let makePass = useCallback((length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    });

    let formatItem = useCallback((item) => {
        return {
            id_number: item.id_number,
            name: item.name,
            dob: item.dob.split('-')[0],
            status: item.status,
            facility: '',
        };
    });

    let initValue = initDataInput(inputField1);
    initValue.Status = '';
    let [inputField, setInputField] = useState(initValue);
    let [validateString, setValidateString] = useState(initValue);

    let initValueSelect = initDataSelect(inputField2, '-- make your choice --');
    initValueSelect.Facility = '-- make your choice --';
    let [selectValue, setSelectValue] = useState(initValueSelect);
    let initSelectValidate = initDataSelect(inputField2, '');
    initSelectValidate.Facility = '';
    let [validateSelect, setValidateSelect] = useState(initSelectValidate);

    let [showList, setShowList] = useState(false);
    let [listFacility, setListFacility] = useState({
        first: [],
        sec: [],
    });
    let contactList = useSelector((state) => state.currentCloseContactList.list);
    let dispatch = useDispatch();
    // console.log(inputField);
    // console.log(selectValue);

    let handleChange = (e, title) => {
        let nVal = e.target.value;
        setInputField({
            ...inputField,
            [title]: nVal,
        });
    };

    let handleRandPass = useCallback((formatedTitle) => {
        let randPass = makePass(6);
        setInputField({
            ...inputField,
            [formatedTitle]: randPass,
        });
        setValidateString({ ...validateString, [formatedTitle]: '' });
    });

    let registerPatient = useCallback(async (data) => {
        try {
            let token = JSON.parse(localStorage.getItem('Token')).token;
            let res = await postAPI('/doctor/patients', data, token);
            console.log(res);

            if (res.message === 'Patient account created and save successfully') {
                setInputField(initValue);
                setSelectValue(initValueSelect);
                dispatch(reset());
            }

            if (!res.message && res.includes('id_number')) {
                console.log(res);
                setValidateString({ ...validateString, ID_number: 'ID number is already exist' });
            } else if (!res.message && res.includes('name')) {
                setValidateString({ ...validateString, Name: 'This name is invalid' });
            }
        } catch (err) {
            console.log(err);
        }
    });

    let validateForm = useCallback((inputField, selectValue) => {
        let validateStr = {};
        let isOke = true;

        Object.keys(inputField).forEach((key) => {
            if (inputField[key] === '') {
                validateStr[key] = returnSpace(key) + ' is required';
                isOke = false;
            }
        });

        Object.keys(selectValue).forEach((key) => {
            if (selectValue[key] === '-- make your choice --') {
                validateSelect[key] = key + ' is required';
                isOke = false;
            }
        });

        if (inputField.Name !== '') {
            if (/^[a-zA-Z ]{1,50}$/.test(inputField.Name) === false) {
                validateStr.Name = 'Name is invalid';
                isOke = false;
            }
        }

        if (inputField.ID_number !== '') {
            let idlen = inputField.ID_number.length;
            if (idlen !== 9 && idlen !== 11) {
                validateStr.ID_number = 'ID number must be 9 or 11 digits';
                isOke = false;
            }
        }

        if (inputField.Year_of_birth !== '') {
            let year = Number(inputField.Year_of_birth);
            let now = new Date();
            let yearNow = now.getFullYear();
            if (year > yearNow) {
                validateStr.Year_of_birth = 'Year of birth must be less or equal than ' + yearNow;
                isOke = false;
            } else if (yearNow - year > 100) {
                validateStr.Year_of_birth = 'Year of birth is invalid';
                isOke = false;
            }
        }

        if (!isOke) {
            setValidateString({ ...validateString, ...validateStr });
            return isOke;
        } else {
            return isOke;
        }
    });

    let handleSubmit = useCallback(() => {
        let contact_list = contactList.map((item) => item._id);
        let readySubmit = validateForm(inputField, selectValue);

        if (readySubmit) {
            let id_facility = '';
            listFacility.first.forEach((item) => {
                if (item.name === selectValue.Facility.split('-')[0]) id_facility = item._id;
            });
            let dataSubmit = {
                username: inputField.ID_number,
                name: inputField.Name,
                dob: inputField.Year_of_birth,
                address: `${selectValue.Province} ${
                    selectValue.District === '-- make your choice --' ? '' : selectValue.District
                } ${selectValue.Ward === '-- make your choice --' ? '' : selectValue.Ward}`.trim(),
                status: inputField.Status || '',
                current_facility: id_facility,
                password: inputField.Password,
                close_contact_list: contact_list,
            };

            registerPatient(dataSubmit);
        }
    });

    let handleDeleteContact = useCallback((index) => {
        dispatch(deleteItem(index));
    });

    let handleChangeSelect = useCallback((value, key) => {
        setSelectValue({ ...selectValue, [key]: value });
        setValidateSelect({ ...validateSelect, [key]: '' });
    });

    let handleChangeStatus = useCallback((e) => {
        setInputField({ ...inputField, Status: e.target.value });
        setValidateString({ ...validateString, Status: '' });
    });

    let getListFacily = useCallback(async () => {
        let list = await getAPI('doctor/facilities');

        let tmp = [];
        list.forEach((item) => {
            let str = item.name + '-' + item.location.province;
            tmp.push(str);
        });

        setListFacility({ first: list, sec: tmp });
    });
    useEffect(() => {
        getListFacily();
    }, []);

    return (
        <div className={cx('wrapper')}>
            {showList ? (
                <ListPatient onBack={() => setShowList(!showList)} />
            ) : (
                <WrapContent>
                    <div onClick={handleSubmit} className={cx('submit-btn', 'flex-center')}>
                        <PlusIcon width="2.5rem" height="2.5rem" />
                    </div>
                    <div className={cx('space')}></div>
                    <div className={cx('row', 'field-input')}>
                        {inputField1.map((title, index) => {
                            let formatedTitle = removeSpace(title);
                            let randPass = title === 'Password';
                            let type = formatedTitle === 'Name' || formatedTitle === 'Password' ? 'text' : 'number';
                            return (
                                <div key={index} className={cx('col3')}>
                                    <label className={cx('flex-center')}>
                                        <span className={cx('label')}>{title}</span>
                                        <FormInput
                                            passGen={randPass}
                                            type={type}
                                            inputVal={inputField[formatedTitle]}
                                            onChange={(e) => handleChange(e, formatedTitle)}
                                            onClick={randPass ? () => handleRandPass(formatedTitle) : () => {}}
                                            onFocus={() =>
                                                setValidateString({ ...validateString, [formatedTitle]: '' })
                                            }
                                        />
                                    </label>
                                    <span className={cx('flex-center', 'attention')}>
                                        {validateString[formatedTitle]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className={cx('row', 'field-input')}>
                        {inputField2.map((title, index) => {
                            let key = title.split('/')[0];
                            return (
                                <div key={index} className={cx('col3')}>
                                    <div className={cx('flex-center')}>
                                        <span className={cx('label')}>{title}</span>
                                        <SelectOption
                                            options={dataAddress[key]}
                                            value={selectValue[key]}
                                            onChange={(value) => handleChangeSelect(value, key)}
                                        />
                                    </div>
                                    <span className={cx('flex-center', 'attention')}>{validateSelect[key]}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col3')}>
                            <div className={cx('flex-center')}>
                                <span className={cx('label')}>Facility</span>
                                <SelectOption
                                    options={listFacility.sec}
                                    value={selectValue['Facility']}
                                    onChange={(value) => handleChangeSelect(value, 'Facility')}
                                />
                            </div>
                            <span className={cx('flex-center', 'attention')}>{validateSelect['Facility']}</span>
                        </div>
                    </div>

                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col2-4', 'flex-center')}>
                            <span className={cx('label')}>Status</span>
                            {Status.map((title, index) => {
                                return (
                                    <label key={index} className={cx('radio')}>
                                        <input
                                            type="radio"
                                            name="state"
                                            checked={inputField.Status === title}
                                            value={title}
                                            onChange={handleChangeStatus}
                                        />
                                        <span className={cx('title-radio')}>{title}</span>
                                    </label>
                                );
                            })}
                        </div>
                        <span className={cx('flex-center', 'attention')}>{validateString['Status']}</span>
                    </div>

                    <div className={cx('row', 'field-input')}>
                        <div className={cx('col2', 'flex-center')}>
                            <span className={cx('label', 'close-contact-label')}>Close contact list</span>
                            <div onClick={() => setShowList(!showList)} className={cx('btn', 'flex-center')}>
                                <PlusIcon width="2rem" height="2rem" />
                            </div>
                        </div>
                        <div className={cx('contact-list')}>
                            {contactList.map((patient, index) => {
                                let item = formatItem(patient);
                                return (
                                    <ListItem
                                        key={index}
                                        infos={item}
                                        showDelete
                                        clickDelete={() => handleDeleteContact(index)}
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

export default InputForm;
