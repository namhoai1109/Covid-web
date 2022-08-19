import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon } from '~/CommonComponent/icons';
import ListItem from '~/CommonComponent/ListItem';
import { FormInput } from '~/CommonComponent/Popper';
import SelectOption from '~/CommonComponent/SelectOption';
import WrapContent from '~/CommonComponent/WrapContent';
import { deleteProduct, resetList, setList } from '../redux/currentListProduct';
import { packageFields, unitTime } from '../staticVar';
import styles from './EssentialPackage.module.scss';
import ListProduct from './ListProduct';
import Counting from '~/CommonComponent/Counting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { putAPI } from '~/APIservices/putAPI';
import { useNavigate } from 'react-router-dom';
import configs from '~/config';
import { setCurr } from '../redux/currentNecessity';

const cx = classNames.bind(styles);

function InfoPackage() {
    let [validate, setValidate] = useState({
        name: '',
        complexFields: '',
        products: '',
    });

    let currentProducts = useSelector((state) => state.currentListProduct.list);
    let currentPackage = useSelector((state) => state.currentPackage.current);
    let [inputFields, setInputFields] = useState({
        name: currentPackage.name || '',
        limit_per_patient: currentPackage.limit_per_patient || '',
        time_limit: {
            value: (currentPackage.time_limit && currentPackage.time_limit.value) || '',
            unit: (currentPackage.time_limit && currentPackage.time_limit.unit) || '--select--',
        },
    });

    let dispatch = useDispatch();
    let navigate = useNavigate();
    let [subPage, setSubPage] = useState(false);
    let [listCounting, setListCounting] = useState({});
    let [updateMode, setUpdateMode] = useState(false);

    useEffect(() => {
        if (currentPackage.products && updateMode) {
            // console.log(currentProducts);
            let tmp = { ...listCounting };
            currentProducts.forEach((item) => {
                if (tmp[item._id] === undefined) {
                    tmp[item._id] = 1;
                }
            });
            setListCounting(tmp);
            if (currentProducts.length > currentPackage.products.length) {
            }
        }
    }, [currentProducts]);

    useEffect(() => {
        if (currentPackage.products) {
            let tmp = {};
            let arr = [];
            currentPackage.products.forEach((product) => {
                arr.push(product.product);
                tmp[product.product._id] = product.quantity;
            });
            setListCounting(tmp);
            dispatch(setList(arr));
        }
        return () => {
            dispatch(resetList());
        };
    }, []);

    let handleInputName = useCallback((e) => {
        let val = e.target.value;
        setInputFields((prev) => ({ ...prev, name: val }));
        setValidate((prev) => ({ ...prev, name: '' }));
    }, []);

    let handleChangeLimit = useCallback((e) => {
        let val = e.target.value;
        setInputFields((prev) => ({ ...prev, limit_per_patient: val }));
        setValidate((prev) => ({ ...prev, complexFields: '' }));
    }, []);
    let handleChangeTimeval = useCallback((e) => {
        let val = e.target.value;
        setInputFields((prev) => ({ ...prev, time_limit: { ...prev.time_limit, value: val } }));
        setValidate((prev) => ({ ...prev, complexFields: '' }));
    }, []);

    let handleChangeSelect = useCallback((val) => {
        setInputFields((prev) => ({ ...prev, time_limit: { ...prev.time_limit, unit: val } }));
        setValidate((prev) => ({ ...prev, complexFields: '' }));
    }, []);

    let handleDeleteProduct = useCallback((index, id) => {
        dispatch(deleteProduct(index));
        setListCounting((prev) => {
            let tmp = { ...prev };
            delete tmp[id];
            return tmp;
        });
    }, []);

    let formatedProducts = useCallback(
        (product) => {
            let id = product._id;
            let increasing = () => {
                setListCounting((prev) => ({ ...prev, [id]: prev[id] + 1 }));
            };

            let decreasing = () => {
                setListCounting((prev) => ({ ...prev, [id]: prev[id] - 1 }));
            };

            let handleShowDetails = () => {
                dispatch(setCurr(product));
                navigate(
                    configs.mainRoutes.doctor +
                        configs.doctorRoutes.essentialPackage +
                        configs.doctorRoutes.infoPackage +
                        configs.doctorRoutes.infoNecessity,
                );
            };

            let nProduct = {
                name: product.name,
                price: product.price,
                quantity_unit: product.quantity_unit,
                counting: (
                    <Counting
                        hideBtn={!updateMode}
                        value={listCounting[id]}
                        increasing={increasing}
                        decreasing={decreasing}
                    />
                ),
                details: !updateMode && (
                    <button className={cx('details')} onClick={handleShowDetails}>
                        details
                    </button>
                ),
            };

            return nProduct;
        },
        [listCounting, updateMode],
    );

    let validateInput = useCallback(() => {
        let validateStr = {};
        let isOke = true;
        if (inputFields.name === '') {
            validateStr.name = 'Name is required';
            isOke = false;
        } else {
            if (/^[a-zA-Z ]{1,50}$/.test(inputFields.name) === false) {
                validateStr.name = 'Name is invalid';
                isOke = false;
            }
        }

        if (
            inputFields.limit_per_patient === '' ||
            inputFields.time_limit.unit === '--select--' ||
            inputFields.time_limit.value === ''
        ) {
            validateStr.complexFields = 'These fields is required';
            isOke = false;
        }

        if (inputFields.limit_per_patient !== '' || inputFields.time_limit.value !== '') {
            if (inputFields.limit_per_patient <= 0 || inputFields.time_limit.value <= 0) {
                validateStr.complexFields = 'Please, enter value greater than 0';
                isOke = false;
            }
        }
        if (currentProducts.length < 2) {
            validateStr.products = 'At least 2 products';
            isOke = false;
        }

        if (!isOke) {
            setValidate(validateStr);
            return isOke;
        } else {
            return isOke;
        }
    }, [inputFields, currentProducts]);

    let handleSubmit = useCallback(async () => {
        let readySubmit = true;
        if (updateMode) {
            readySubmit = validateInput();
            if (readySubmit) {
                let products = [];
                Object.keys(listCounting).forEach((id) => {
                    products.push({
                        product: id,
                        quantity: listCounting[id],
                    });
                });
                inputFields.time_limit.value = Number(inputFields.time_limit.value);
                let data = {
                    name: inputFields.name,
                    time_limit: inputFields.time_limit,
                    limit_per_patient: Number(inputFields.limit_per_patient),
                    products: products,
                };

                console.log(data);
                let res = await putAPI('doctor/packages/id=' + currentPackage._id, data);
                console.log(res);
            }
        }

        if (readySubmit) setUpdateMode(!updateMode);
    }, [inputFields, listCounting, updateMode, currentPackage]);

    return (
        <div className={cx('wrapper')}>
            {subPage ? (
                <ListProduct onBack={() => setSubPage(false)} />
            ) : (
                <WrapContent>
                    {updateMode && <div className={cx('noti')}>Now you can update the information</div>}
                    <button onClick={handleSubmit} className={cx('submit-btn', 'flex-center')}>
                        {updateMode ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faPenToSquare} />}
                    </button>
                    <div>
                        <div className={cx('input-field', 'flex-center')}>
                            <span className={cx('label')}>Name</span>
                            <FormInput
                                readOnly={!updateMode}
                                inputVal={inputFields.name}
                                onChange={(e) => handleInputName(e)}
                            />
                        </div>
                        <span
                            className={cx({
                                validate: validate.name !== '',
                            })}
                        >
                            {validate.name}
                        </span>
                    </div>
                    <div>
                        <div className={cx('input-field', 'flex-center')}>
                            <span className={cx('label')}>Maximum number of packages:</span>
                            <FormInput
                                readOnly={!updateMode}
                                inputVal={inputFields.limit_per_patient}
                                tiny
                                type="number"
                                onChange={(e) => handleChangeLimit(e)}
                            />
                            <span className={cx('label', 'ml')}>in</span>
                            <FormInput
                                readOnly={!updateMode}
                                tiny
                                type="number"
                                inputVal={inputFields.time_limit.value}
                                onChange={(e) => handleChangeTimeval(e)}
                            />
                            <div className={cx('select-field')}>
                                <SelectOption
                                    readOnly={!updateMode}
                                    options={unitTime}
                                    tiny
                                    value={inputFields.time_limit.unit}
                                    onChange={(val) => handleChangeSelect(val)}
                                />
                            </div>
                        </div>
                        <span
                            className={cx({
                                validate: validate.complexFields !== '',
                            })}
                        >
                            {validate.complexFields}
                        </span>
                    </div>
                    <div className={cx('input-field', 'flex-center')}>
                        <span className={cx('label', 'title')}>Add products</span>
                        <div
                            onClick={
                                updateMode
                                    ? () => {
                                          setSubPage(true);
                                          setValidate({ ...validate, products: '' });
                                      }
                                    : () => {}
                            }
                            className={cx('icon', 'flex-center', {
                                disabled: !updateMode,
                            })}
                        >
                            <PlusIcon width="2rem" height="2rem" />
                        </div>
                        <span className={cx('validate')}>{validate.products}</span>
                    </div>

                    <div className={cx('list-product')}>
                        <ListItem noUnderLine infos={packageFields} />
                        {currentProducts.map((product, index) => {
                            let nProduct = formatedProducts(product);
                            return (
                                <ListItem
                                    key={index}
                                    infos={nProduct}
                                    showDelete={updateMode}
                                    clickDelete={() => handleDeleteProduct(index, product._id)}
                                />
                            );
                        })}
                    </div>
                </WrapContent>
            )}
        </div>
    );
}

export default InfoPackage;
