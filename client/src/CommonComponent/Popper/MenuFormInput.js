import TippyHeadless from '@tippyjs/react/headless';
import Wrapper, { MenuItem } from '../Popper';
import { PlusIcon } from '../icons';
import { FormInput } from '../Popper';

import classNames from 'classnames/bind';
import styles from './Wrapper.module.scss';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

let initDataInput = (num) => {
    let data = {};
    for (let i = 0; i < num; i++) {
        data[`input${i}`] = '';
    }

    return data;
};

function makePass(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function MenuFormInput({ menu, onClick = () => {}, children }) {
    let initInputVal = initDataInput(menu.length);

    let [inputVals, setInputVals] = useState(initInputVal);

    useEffect(() => {
        setInputVals(initDataInput(menu.length));
    }, [menu]);

    let handleOnClick = () => {
        //call api
        onClick(inputVals);
        setInputVals(initInputVal);
    };

    let handleHide = () => {
        setInputVals(initInputVal);
    };

    let handleChange = (e, index) => {
        let inputval = e.target.value;
        setInputVals({
            ...inputVals,
            [`input${index}`]: inputval,
        });
    };

    let handleRandPass = (index) => {
        let randPass = makePass(6);
        setInputVals({
            ...inputVals,
            [`input${index}`]: randPass,
        });
    }

    let renderItem = (attrs) => (
        <div tabIndex="-1" {...attrs}>
            <Wrapper>
                <button onClick={handleOnClick} className={cx('submit-btn')}>
                    <PlusIcon />
                </button>
                <div className={cx('flex-center')}>
                    <div>
                        {menu.map((title, index) => (
                            <MenuItem key={index} data={title} className={cx('title')} />
                        ))}
                    </div>
                    <div>
                        {menu.map((title, index) => {
                            return (
                                <MenuItem
                                    nohover
                                    key={index}
                                    data={
                                        <FormInput
                                            passGen={title === "Password:"}
                                            onClick={e => handleRandPass(index)}
                                            inputVal={inputVals[`input${index}`]}
                                            onChange={(e) => handleChange(e, index)}
                                        />
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

export default MenuFormInput;
