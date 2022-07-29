import TippyHeadless from '@tippyjs/react/headless';
import Wrapper, { MenuItem } from '../Popper';
import { PlusIcon } from '../icons';
import { FormInput } from '../Popper';

import classNames from 'classnames/bind';
import styles from './Wrapper.module.scss';
import { memo, useCallback, useEffect, useState } from 'react';
import SelectOption from '../SelectOption';
import { dataAddress } from '~/Admin/staticVar';

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

    let initInputVal = initDataInput(menu);
    let [inputVals, setInputVals] = useState(initInputVal);

    useEffect(() => {
        setInputVals(initDataInput(menu));
    }, [menu]);

    let handleOnClick = useCallback(async () => {
        let clearInput = await onClick(inputVals);
        if (clearInput) {
            setInputVals(initInputVal);
        }
    });

    let handleHide = useCallback(() => {
        setInputVals(initInputVal);
    });

    let handleChange = useCallback((e, title) => {
        let inputval = e.target.value;
        setInputVals({
            ...inputVals,
            [title]: inputval,
        });
        setValidateStr('');
    });

    let handleRandPass = useCallback((title) => {
        let randPass = makePass(6);
        setInputVals({
            ...inputVals,
            [title]: randPass,
        });
        setValidateStr('');
    });

    let handleChangeSelect = useCallback((val, title) => {
        setInputVals({
            ...inputVals,
            [title]: val,
        });
        setValidateStr('');
    });

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
                            let dataSelect = dataAddress[item.title.split('/')[0]];
                            return (
                                <MenuItem
                                    nohover
                                    key={index}
                                    data={
                                        item.type === 'select' ? (
                                            <SelectOption
                                                options={dataSelect}
                                                value={inputVals[nTitle]}
                                                onChange={(val) => handleChangeSelect(val, nTitle)}
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
