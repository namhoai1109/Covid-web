import classNames from 'classnames/bind';
import { FormInput } from '~/CommonComponent/Popper';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './EssentialItem.module.scss';
import { necessityFields, typeNecessity } from '../staticVar';
import SelectOption from '~/CommonComponent/SelectOption';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PlusIcon } from '~/CommonComponent/icons';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { putAPI } from '~/APIservices/putAPI';
import { removeCurr } from '../redux/currentNecessity';
import { setMess } from '../redux/messNoti';

const cx = classNames.bind(styles);

function InfoNecessity({ viewOnly }) {
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

    let infoNecessity = useSelector((state) => state.currentNecessity.curr);
    //console.log(infoNecessity);
    let dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(removeCurr());
        };
    }, []);

    let setFirstValue = useCallback((menu) => {
        let data = {};
        for (let i = 0; i < menu.length; i++) {
            let key = removeSpace(menu[i]);
            data[key] = infoNecessity[key.toLocaleLowerCase()];
        }

        return data;
    }, []);

    //update mode
    let [updateMode, setUpdateMode] = useState(false);

    //input images
    let [imgs, setImgs] = useState(infoNecessity.images || []);
    let inputRef = useRef();
    let [deletions, setDeletions] = useState([]);
    //console.log(imgs, deletions);

    //input field
    let initData = setFirstValue(necessityFields);
    initData.Type = infoNecessity.type;
    let [dataInput, setDataInput] = useState(initData);

    //validate
    let validateData = initDataInput(necessityFields);
    validateData.Type = '';
    validateData.Images = '';
    let [validate, setValidate] = useState(validateData);

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

    //handle event
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

    let handleDeleteImg = (index) => {
        let img = imgs[index];
        if (typeof img === 'string') {
            setDeletions([...deletions, img]);
            let nArr = [...imgs];
            nArr.splice(index, 1);
            setImgs(nArr);
        } else {
            let nArr = [...imgs];
            nArr.splice(index, 1);
            setImgs(nArr);
        }
    };

    let handleSubmit = async () => {
        let isOke = true;
        if (updateMode) {
            isOke = validateDataSubmit(dataInput, imgs);
            if (isOke) {
                let formData = new FormData();
                if (imgs.length > 0) {
                    imgs.forEach((file) => {
                        if (typeof file !== 'string') {
                            formData.append('images', file);
                        }
                    });
                }

                if (deletions.length > 0) {
                    deletions.forEach((file) => {
                        formData.append('deletions', file);
                    });
                }

                Object.keys(dataInput).forEach((key) => {
                    formData.append(key.toLocaleLowerCase(), dataInput[key]);
                });

                let res = await putAPI('doctor/products/id=' + infoNecessity._id, formData);
                console.log(res);
                dispatch(setMess({ mess: 'Update successfully', type: 'success' }));
            }
        }

        if (isOke) setUpdateMode(!updateMode);
    };

    return (
        <div className={cx('wrapper')}>
            <WrapContent>
                {updateMode && <div className={cx('noti')}>Now you can update the information</div>}
                {!viewOnly && (
                    <button onClick={handleSubmit} className={cx('submit-btn', 'flex-center')}>
                        {updateMode ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faPenToSquare} />}
                    </button>
                )}
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
                                    readOnly={!updateMode}
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
                            readOnly={!updateMode}
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
                        let url = typeof img === 'string' ? `https://localhost:5000/${img}` : URL.createObjectURL(img);
                        return (
                            <div key={index} className={cx('img-item')}>
                                <div className={cx('img')}>
                                    <img src={url} />
                                </div>
                                {updateMode && (
                                    <button
                                        onClick={() => handleDeleteImg(index)}
                                        className={cx('delete-img', 'flex-center')}
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {updateMode && imgs.length < 5 && (
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

export default InfoNecessity;
