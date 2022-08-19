import TippyHeadless from '@tippyjs/react/headless';
import Wrapper, { MenuItem } from '../Popper';
import { PlusIcon } from '../icons';
import { FormInput } from '../Popper';
import classNames from 'classnames/bind';
import styles from './Wrapper.module.scss';
import { memo, useCallback, useEffect, useState } from 'react';
import SelectOption from '../SelectOption';
import { getAPI } from '~/APIservices/getAPI';

const cx = classNames.bind(styles);

function MenuFormInput({ menu, onClick = () => {}, children, validateStr, setValidateStr }) {
    let initDataInput = useCallback((menu) => {
        let data = {};
        for (let i = 0; i < menu.length; i++) {
            if (menu[i].type === 'select') {
                data[menu[i].title.toLowerCase()] = `--select--`;
            } else {
                data[menu[i].title.toLowerCase()] = '';
            }
        }
        return data;
    }, []);

    let makePass = useCallback((length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }, []);

    let initInputVal = initDataInput(menu);
    let [inputVals, setInputVals] = useState(initInputVal);

    useEffect(() => {
        setInputVals(initDataInput(menu));
    }, [menu]);

    let [stateSelect, setStateSelect] = useState({ listFirst: [], Province: [], District: [], Ward: [] });

    let getListProvince = useCallback(async () => {
        let list = await getAPI('facility/provinces');
        let listProvince = getListAddress(list);
        setStateSelect({ ...stateSelect, listFirst: list, Province: listProvince });
    }, []);

    let getListAddress = useCallback((list) => {
        let tmp = [];
        for (let i = 0; i < 5; i++) {
            tmp.push(list[i].name);
        }

        return tmp;
    }, []);

    useEffect(() => {
        getListProvince();
    }, []);

    let handleOnClick = useCallback(async () => {
        let clearInput = await onClick(inputVals);
        if (clearInput) {
            setInputVals(initInputVal);
        }
    }, [inputVals]);

    let handleHide = useCallback(() => {
        setInputVals(initInputVal);
    }, [initInputVal]);

    let handleChange = useCallback(
        (e, title) => {
            let inputval = e.target.value;
            setInputVals({
                ...inputVals,
                [title]: inputval,
            });
            setValidateStr('');
        },
        [inputVals],
    );

    let handleRandPass = useCallback(
        (title) => {
            let randPass = makePass(6);
            setInputVals({
                ...inputVals,
                [title]: randPass,
            });
            setValidateStr('');
        },
        [inputVals],
    );

    let handleChangeSelect = useCallback(
        (val, title, typeSelect) => {
            if (typeSelect === 'Province') {
                stateSelect.listFirst.forEach((item) => {
                    if (item.name === val) {
                        let listDistrict = getListAddress(item.districts);
                        setStateSelect({ ...stateSelect, District: listDistrict });
                    }
                });
            } else if (typeSelect === 'District') {
                stateSelect.listFirst.forEach((item) => {
                    if (item.name === inputVals['province/city']) {
                        item.districts.forEach((district) => {
                            if (district.name === val) {
                                let listWard = getListAddress(district.wards);
                                setStateSelect({ ...stateSelect, Ward: listWard });
                            }
                        });
                    }
                });
            }

            setInputVals({
                ...inputVals,
                [title]: val,
            });
            setValidateStr('');
        },
        [inputVals],
    );

    let renderItem = (attrs) => (
        <div tabIndex="-1" {...attrs}>
            <Wrapper>
                <button onClick={handleOnClick} className={cx('submit-btn')}>
                    <PlusIcon />
                </button>
                <span className={cx('noti')}>{validateStr}</span>
                <div className={cx('flex-center')}>
                    <div>
                        {menu.map((item, index) => (
                            <MenuItem key={index} data={item.title} className={cx('title')} />
                        ))}
                    </div>
                    <div>
                        {menu.map((item, index) => {
                            let nTitle = item.title.toLowerCase();
                            let typeSelect = item.title.split('/')[0];
                            return (
                                <MenuItem
                                    nohover
                                    key={index}
                                    data={
                                        item.type === 'select' ? (
                                            <SelectOption
                                                options={stateSelect[typeSelect]}
                                                value={inputVals[nTitle]}
                                                onChange={(val) => handleChangeSelect(val, nTitle, typeSelect)}
                                            />
                                        ) : (
                                            <FormInput
                                                type={item.type === 'number' ? item.type : 'text'}
                                                passGen={item.type === 'passGen'}
                                                onClick={(e) => handleRandPass(nTitle)}
                                                inputVal={inputVals[nTitle]}
                                                onChange={(e) => handleChange(e, nTitle)}
                                            />
                                        )
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            </Wrapper>
        </div>
    );

    return (
        <div>
            <TippyHeadless
                interactive
                offset={[0, 10]}
                placement="bottom-end"
                render={renderItem}
                onHide={handleHide}
                trigger="click"
            >
                {children}
            </TippyHeadless>
        </div>
    );
}

export default memo(MenuFormInput);
