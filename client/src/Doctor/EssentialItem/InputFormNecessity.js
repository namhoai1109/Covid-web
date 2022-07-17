import classNames from "classnames/bind";
import { FormInput } from "~/CommonComponent/Popper";
import WrapContent from "~/CommonComponent/WrapContent";
import styles from "./EssentialItem.module.scss";
import { necessityFields, typeNecessity } from "../staticVar";
import SelectOption from "~/CommonComponent/SelectOption";
import { useState } from "react";

const cx = classNames.bind(styles);

function InputForm() {
    let [type, setType] = useState('--choose type--');
    let [imgs, setImgs] = useState([]);

    let handleChooseFile = (e) => {
        if (e.target.files[0]) {
            setImgs([...imgs, e.target.files[0]]);
        }
    }
    console.log(imgs)
    return ( <div className={cx('wrapper')}>
        <WrapContent>
            {necessityFields.map((title, index) => {
                return <div 
                    key={index} 
                    className={cx('field-input', 'flex-center')}
                    >
                        {title} 
                        <FormInput />
                    </div>
            })}
            <div className={cx('field-input', 'flex-center')}>
                Type
                <SelectOption options={typeNecessity} value={type} onChange={val => setType(val)} />
            </div>
            <div className={cx('flex-center', 'list-img')}>
                {imgs.map((img, index) => {
                    return <img className={cx('img')} key={index} src={URL.createObjectURL(img)} />
                })}
                <input className={cx('input-file')} type="file" onChange={handleChooseFile} accept="image/png, image/jpeg" />
            </div>
        </WrapContent>
    </div> );
}

export default InputForm;