import classNames from 'classnames/bind';
import styles from './SearchInput.module.scss';
import { memo, useState } from 'react';

const cx = classNames.bind(styles);

function SearchInput({ stateDynamique, icon }) {
    let [searchVal, setSearchVal] = useState('');
    let [skrink, setSkrink] = useState(stateDynamique);

    let handleBlur = () => {
        if (stateDynamique) {
            if (searchVal === '') {
                setSkrink(true);
            }
        }
    };

    let handleClick = () => {
        if (stateDynamique) {
            setSkrink(!skrink);
        }

        if (searchVal !== '') {
            console.log(searchVal); //call api
            setSkrink(false);
        }
    };

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
