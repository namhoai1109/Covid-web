import classNames from 'classnames/bind';
import { FormInput } from '~/CommonComponent/Popper';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './CovidPatient.module.scss';
import { inputField1, inputField2, Status, dataAddress } from '../staticVar';
import { useCallback, useState } from 'react';
import SelectOption from '~/CommonComponent/SelectOption';
import { PlusIcon } from '~/CommonComponent/icons';
import { Link } from 'react-router-dom';
import configs from '~/config';
import { useDispatch } from 'react-redux';
import { addPatient } from '../redux/listPatientSlice';
import { postAPI } from '~/APIservices/postAPI';

const cx = classNames.bind(styles);

function InputForm() {
    let initDataInput = useCallback((menu) => {
        let data = {};
        for (let i = 0; i < menu.length; i++) {
            data[removeSpace(menu[i])] = '';
        }

        return data;
    });

    let initDataSelect = useCallback((menu) => {
        let data = {};
        for (let i = 0; i < menu.length; i++) {
            data[menu[i].split('/')[0]] = `-- make your choice --`;
        }
        return data;
    });

    let removeSpace = useCallback((title) => {
        return title.replaceAll(' ', '_');
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

    let initValue = initDataInput(inputField1);
    let initValueSelect = initDataSelect(inputField2);
    let [inputField, setInputField] = useState(initValue);
    let [selectValue, setSelectValue] = useState(initValueSelect);
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

    let handleRandPass = (title) => {
        let randPass = makePass(6);
        setInputField({
            ...inputField,
            [title]: randPass,
        });
    };

    let registerPatient = useCallback(async (data) => {
        try {
            let token = JSON.parse(localStorage.getItem('Token')).token;
            let res = postAPI('/doctor/patients', data, token);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    });

    let handleSubmit = () => {
        let dataSubmit = {
            username: inputField.ID_number,
            name: inputField.Name,
            DOB: inputField.Year_of_birth,
            address: `${selectValue.Province} ${
                selectValue.District === '-- make your choice --' ? '' : selectValue.District
            } ${selectValue.Ward === '-- make your choice --' ? '' : selectValue.Ward}`.trim(),
            status: inputField.Status || '',
            //current_facility: selectValue.Facility,
            password: inputField.Password,
        };

        // dispatch(addPatient(dataSubmit));
        registerPatient(dataSubmit);
        setInputField(initValue);
        setSelectValue(initValueSelect);
    };

    return (
        <div className={cx('wrapper')}>
            <WrapContent>
                <div onClick={handleSubmit} className={cx('submit-btn', 'flex-center')}>
                    <PlusIcon width="2.5rem" height="2.5rem" />
                </div>
                <div className={cx('row', 'field-input')}>
                    {inputField1.map((title, index) => {
                        let formatedTitle = removeSpace(title);
                        let randPass = title === 'Password';
                        let type = formatedTitle === 'Name' || formatedTitle === 'Password' ? 'text' : 'number';
                        return (
                            <label key={index} className={cx('col3', 'flex-center')}>
                                <span className={cx('label')}>{title}</span>
                                <FormInput
                                    passGen={randPass}
                                    type={type}
                                    inputVal={inputField[formatedTitle]}
                                    onChange={(e) => handleChange(e, formatedTitle)}
                                    onClick={randPass ? () => handleRandPass(title) : () => {}}
                                />
                            </label>
                        );
                    })}
                </div>

                <div className={cx('row', 'field-input')}>
                    {inputField2.map((title, index) => {
                        let key = title.split('/')[0];
                        return (
                            <div key={index} className={cx('col3', 'flex-center')}>
                                <span className={cx('label')}>{title}</span>
                                <SelectOption
                                    options={dataAddress[key]}
                                    value={selectValue[key]}
                                    onChange={(value) => setSelectValue({ ...selectValue, [key]: value })}
                                />
                            </div>
                        );
                    })}
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
                                        onChange={(e) => setInputField({ ...inputField, Status: e.target.value })}
                                    />
                                    <span className={cx('title-radio')}>{title}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className={cx('row', 'field-input')}>
                    <div className={cx('col3', 'flex-center')}>
                        <span className={cx('label', 'close-contact-label')}>Close contact list</span>
                        <Link
                            to={configs.mainRoutes.doctor + configs.doctorRoutes.listPatient}
                            className={cx('btn', 'flex-center')}
                        >
                            <PlusIcon width="2rem" height="2rem" />
                        </Link>
                    </div>
                </div>
            </WrapContent>
        </div>
    );
}

export default InputForm;
