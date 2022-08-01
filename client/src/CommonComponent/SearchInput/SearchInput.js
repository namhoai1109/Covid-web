import classNames from 'classnames/bind';
import styles from './SearchInput.module.scss';
import { memo, useCallback, useEffect, useState } from 'react';
import { searchAPI } from '~/APIservices/searchAPI';
import { addFilter } from '~/Doctor/redux/filterState';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles);

function SearchInput({ stateDynamique, icon, filter = '', url, dispatchFunc }) {
    let [searchVal, setSearchVal] = useState('');
    let [skrink, setSkrink] = useState(stateDynamique);
    let dispatch = useDispatch();

    let handleBlur = useCallback(() => {
        if (stateDynamique) {
            if (searchVal === '') {
                setSkrink(true);
            }
        }
    });

    let handleClick = useCallback(() => {
        if (stateDynamique) {
            setSkrink(!skrink);
        }

        if (searchVal !== '') {
            setSkrink(false);
        }
    });

    let fetchSearchValue = useCallback(async () => {
        let res = await searchAPI(url, filter, searchVal);
        dispatchFunc(res);
    });

    useEffect(() => {
        if (filter !== '') dispatch(addFilter(filter));
    }, []);

    useEffect(() => {
        if (searchVal !== '') {
            fetchSearchValue();
        }
    }, [searchVal]);

    return (
        <div className={cx('wrapper')}>
            <input
                className={cx('input', {
                    skrink: skrink,
                })}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSkrink(false)}
                onBlur={handleBlur}
            />
            <button onClick={handleClick} onBlur={handleBlur} className={cx('btn')}>
                {icon}
            </button>
        </div>
    );
}

export default memo(SearchInput);
