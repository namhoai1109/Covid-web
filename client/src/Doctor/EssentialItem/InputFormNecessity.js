import classNames from 'classnames/bind';
import { FormInput } from '~/CommonComponent/Popper';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './EssentialItem.module.scss';
import { necessityFields, typeNecessity } from '../staticVar';
import SelectOption from '~/CommonComponent/SelectOption';
import { useCallback, useRef, useState } from 'react';
import { PlusIcon } from '~/CommonComponent/icons';
import { postFormAPI } from '~/APIservices/postFormAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { setMess } from '../redux/messNoti';

const cx = classNames.bind(styles);

function InputForm() {
    let removeSpace = useCallback((title) => {
        return title.replaceAll(' ', '_');
    }, []);

    let returnSpace = useCallback((title) => {
        return title.replaceAll('_', ' ');
    }, []);

    let initDataInput = useCallback((menu) => {
        let data = {};
        for (let i = 0; i < menu.length; i++) {
            data[removeSpace(menu[i])] = '';
        }

        return data;
    }, []);

    let [imgs, setImgs] = useState([]);
    let inputRef = useRef();

    let initData = initDataInput(necessityFields);
    initData.Type = '--choose type--';
    let [dataInput, setDataInput] = useState(initData);

    let validateData = initDataInput(necessityFields);
    validateData.Type = '';
    validateData.Images = '';
    let [validate, setValidate] = useState(validateData);
    let dispatch = useDispatch();

    let handleChooseFile = (e) => {
        let files = e.target.files;
        let arrFiles = [];
        for (let i = 0; i < files.length; i++)
            if (files[i]) {
                arrFiles.push(files[i]);
            }
        let tmp = [...imgs, ...arrFiles];
        if (tmp.length > 5) {
            tmp = tmp.slice(0, 5);
        }
        setImgs([...tmp]);
    };

    let handleClickInput = () => {
        inputRef.current.click();
        setValidate({ ...validate, Images: '' });
    };

    let handleChangeInput = (val, title) => {
        setDataInput({ ...dataInput, [title]: val });
        setValidate({ ...validate, [title]: '' });
    };

    let validateDataSubmit = (dataInput, listFile) => {
        let isOk = true;

        let vForm = {};
        Object.keys(dataInput).forEach((key) => {
            if (dataInput[key] === '') {
                vForm[key] = returnSpace(key) + ' is required';
                isOk = false;
            } else if (key === 'Type') {
                if (dataInput[key] === '--choose type--') {
                    vForm[key] = 'Type is required';
                    isOk = false;
                }
            }
        });
        if (listFile.length === 0) {
            vForm.Images = 'Images is required';
            isOk = false;
        }

        if (dataInput.Price !== '') {
            if (isNaN(dataInput.Price) || dataInput.Price < 0) {
                vForm.Price = 'Price is invalid';
                isOk = false;
            }
        }
        setValidate(vForm);

        return isOk;
    };

    let handleDeleteImg = (index) => {
        let newImgs = [...imgs];
        newImgs.splice(index, 1);
        setImgs(newImgs);
    };

    let handleSubmit = async () => {
        let isOke = validateDataSubmit(dataInput, imgs);
        if (isOke) {
            let formData = new FormData();
            imgs.forEach((file) => {
                formData.append('images', file);
            });

            Object.keys(dataInput).forEach((key) => {
                formData.append(key.toLocaleLowerCase(), dataInput[key]);
            });

            let res = await postFormAPI('/doctor/products', formData);
            console.log(res);
            setDataInput(initData);
            setImgs([]);
            dispatch(setMess({ mess: 'Add product successfully', type: 'success' }));
        }
    };

    return (
        <div className={cx('wrapper')}>
            <WrapContent>
                <button onClick={handleSubmit} className={cx('submit-btn', 'flex-center')}>
                    <PlusIcon width="2.5rem" height="2.5rem" />
                </button>
                {necessityFields.map((title, index) => {
                    let formatedTitle = removeSpace(title);
                    let number = formatedTitle === 'Price';
                    return (
                        <div key={index} className={cx('wrap-field')}>
                            <div className={cx('field-input', 'flex-center')}>
                                {title}
                                <FormInput
                                    type={number ? 'number' : 'text'}
                                    inputVal={dataInput[formatedTitle]}
                                    onChange={(e) => handleChangeInput(e.target.value, formatedTitle)}
                                />
                            </div>
                            <span className={cx('attention')}>{validate[formatedTitle]}</span>
                        </div>
                    );
                })}
                <div className={cx('wrap-field')}>
                    <div className={cx('field-input', 'flex-center')}>
                        Type
                        <SelectOption
                            options={typeNecessity}
                            value={dataInput.Type}
                            onChange={(val) => handleChangeInput(val, 'Type')}
                        />
                    </div>
                    <span className={cx('attention')}>{validate.Type}</span>
                </div>

                <div className={cx('title-list-img')}>Choose picture for product:</div>
                <div className={cx('wrap-field')}>
                    <span className={cx('attention')}>{validate.Images}</span>
                </div>
                <div className={cx('flex-center', 'list-img')}>
                    {imgs.map((img, index) => {
                        return (
                            <div key={index} className={cx('img-item')}>
                                <div className={cx('img')}>
                                    <img src={URL.createObjectURL(img)} />
                                </div>
                                <button
                                    onClick={() => handleDeleteImg(index)}
                                    className={cx('delete-img', 'flex-center')}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        );
                    })}
                    {imgs.length < 5 && (
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
                    )}
                </div>
            </WrapContent>
        </div>
    );
}

export default InputForm;
