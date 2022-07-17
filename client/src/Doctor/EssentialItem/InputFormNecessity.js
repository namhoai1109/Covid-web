import classNames from 'classnames/bind';
import { FormInput } from '~/CommonComponent/Popper';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './EssentialItem.module.scss';
import { necessityFields, typeNecessity } from '../staticVar';
import SelectOption from '~/CommonComponent/SelectOption';
import { useRef, useState } from 'react';
import { PlusIcon } from '~/CommonComponent/icons';

const cx = classNames.bind(styles);

function InputForm() {
    let [type, setType] = useState('--choose type--');
    let [imgs, setImgs] = useState([]);
    let inputRef = useRef();

    let handleChooseFile = (e) => {
        let files = e.target.files;
        let arrFiles = [];
        for (let i = 0; i < files.length; i++)
            if (files[i]) {
                arrFiles.push(files[i]);
            }
        setImgs([...imgs, ...arrFiles]);
    };

    let handleClickInput = () => {
        inputRef.current.click();
    };

    return (
        <div className={cx('wrapper')}>
            <WrapContent>
                {necessityFields.map((title, index) => {
                    return (
                        <div key={index} className={cx('field-input', 'flex-center')}>
                            {title}
                            <FormInput />
                        </div>
                    );
                })}
                <div className={cx('field-input', 'flex-center')}>
                    Type
                    <SelectOption options={typeNecessity} value={type} onChange={(val) => setType(val)} />
                </div>

                <div className={cx('title-list-img')}>Choose picture for product:</div>
                <div className={cx('flex-center', 'list-img')}>
                    {imgs.map((img, index) => {
                        return (
                            <div className={cx('img')}>
                                <img key={index} src={URL.createObjectURL(img)} />
                            </div>
                        );
                    })}
                    <div onClick={handleClickInput} className={cx('wrap-input-file')}>
                        <input
                            className={cx('input-file')}
                            type="file"
                            ref={inputRef}
                            onChange={handleChooseFile}
                            accept="image/png, image/jpeg, image/jpg"
                            multiple
                        />
                        <div className={cx('add-btn')}>
                            <PlusIcon width="4rem" height="4rem" />
                        </div>
                    </div>
                </div>
            </WrapContent>
        </div>
    );
}

export default InputForm;
