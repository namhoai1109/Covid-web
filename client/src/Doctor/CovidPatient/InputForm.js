import classNames from "classnames/bind";
import { FormInput } from "~/CommonComponent/Popper";
import WrapContent from "~/CommonComponent/WrapContent";
import styles from "./CovidPatient.module.scss";
import { inputField1, inputField2, provinces, state } from "../staticVar";
import { useState } from "react";
import SelectOption from "~/CommonComponent/SelectOption";
import { PlusIcon } from "~/CommonComponent/icons";
import { Link } from "react-router-dom";
import configs from "~/config";

const cx = classNames.bind(styles);

let removeSpace = (title) => {
    return title.replaceAll(' ', '_');
}

let initDataInput = (menu) => {
    let data = {};
    for (let i = 0; i < menu.length; i++) {
        data[removeSpace(menu[i])] = '';
    }

    return data;
};

function InputForm() {
    let initValue = initDataInput(inputField1);
    let [inputField, setInputField] = useState(initValue);
    let [selectValue, setSelectValue] = useState('--choose--');

    let handleChange = (e, title) => {
        let nVal = e.target.value
        setInputField({
            ...inputField,
            [title]: nVal
        })
    }

    
    return ( <div className={cx('wrapper')}>
        <WrapContent>
            <div className={cx('row', 'field-input')}>
                {inputField1.map((title, index) => {
                    let formatedTitle = removeSpace(title)
                    return <label key={index} className={cx('col3', 'flex-center')}>
                        <span className={cx('label')}>{title}</span> 
                        <FormInput 
                            type={formatedTitle === 'Name' ? 'text' : 'number'} 
                            inputVal={inputField[formatedTitle]} 
                            onChange={e => handleChange(e, formatedTitle)} 
                        />
                    </label>}
                )}
            </div>

            <div className={cx('row', 'field-input')}>
                {inputField2.map((title, index) => {
                    return <div key={index} className={cx('col3', 'flex-center')}>
                        <span className={cx('label')}>{title}</span>
                        <SelectOption options={provinces} value={selectValue} onChange={value => setSelectValue(value)} />
                    </div>
                })}
            </div>

            <div className={cx('row', 'field-input')}>
                <div className={cx('col2-4', 'flex-center')}>
                    <span className={cx('label')}>State</span>
                    {state.map((title, index) => {
                        return <label key={index} className={cx('radio')}>
                            <input type='radio' name="state" value={title} />
                            <span className={cx('title-radio')}>{title}</span>
                        </label>
                    })}
                </div>
            </div>

            <div className={cx('row','field-input')}>
                    <div className={cx('col3', 'flex-center')}>
                        <span className={cx('label', 'close-contact-label')}>Close contact list</span> 
                        <Link 
                            to={configs.mainRoutes.doctor + configs.doctorRoutes.listPatient}
                            className={cx('btn', 'flex-center')}><PlusIcon width="2rem" height="2rem" /></Link>
                    </div>
            </div>
            </WrapContent>
    </div> );
}

export default InputForm;