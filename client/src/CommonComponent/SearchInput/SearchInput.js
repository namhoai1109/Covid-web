import classNames from 'classnames/bind';
import styles from './SearchInput.module.scss';
import { memo, useCallback, useEffect, useState } from 'react';
import { addFilter, setSearchValue, setValue } from '~/Doctor/redux/filterState';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles);

function SearchInput({ stateDynamique, icon, filter = '' }) {
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

    useEffect(() => {
        let nFilter = filter.replaceAll(' ', '_');
        if (filter !== '') dispatch(addFilter(nFilter));
    }, []);

    useEffect(() => {
        if (filter !== '') {
            let nFilter = filter.replaceAll(' ', '_');
            dispatch(setValue({ filter: nFilter, value: searchVal }));
        } else {
            dispatch(setSearchValue(searchVal));
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
