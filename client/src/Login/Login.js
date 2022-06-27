import classNames from 'classnames/bind';
import { useState } from 'react';
import { FormInput } from '~/CommonComponent/Popper';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

function Login() {
    let [ ID, setID ] = useState('');
    let [ password, setPassword ] = useState('');

    let handleClick = () => {
        console.log(ID, password);
    }

    return <div className={cx('wrapper')}>
        <div className={cx('form')}>
            <label>enter ID: <FormInput inputVal={ID} onChange={e => setID(e.target.value)} /> </label>
            <label>enter ID: <FormInput inputVal={password} onChange={e => setPassword(e.target.value)} /> </label>
            <button onClick={handleClick}>Sign In</button>
        </div>
    </div>;
}

export default Login;