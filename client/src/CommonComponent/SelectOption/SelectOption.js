import classNames from "classnames/bind";
import { useState } from "react";
import styles from "./SelectOption.module.scss";


const cx = classNames.bind(styles);

function SelectOption({ options, value, onChange }) {
    let [option, setOption] = useState(value);
    let [showOptions, setShowOptions] = useState(false);

    let handleShowOption = () => {
        setShowOptions(!showOptions)
    }

    let handleValueOption = (value) => {
        setOption(value);
        onChange(value);
        setShowOptions(false);
    }

    return <div onClick={handleShowOption} className={cx('custom-select', {up: showOptions})}>
        <div onClick={handleShowOption} className={cx('curr-option')}>{option}</div>
        <div className={cx('list-option', {
            show_list_option: showOptions
        })}>
            {options.map((option, index) => {
                return <div onClick={e => handleValueOption(option)} className={cx('option')} key={index}>{option}</div>
            })}
        </div>
    </div> ;
}

export default SelectOption;