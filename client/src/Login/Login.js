import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FormInput } from '~/CommonComponent/Popper';
import styles from './Login.module.scss';
import { postAPI } from '~/APIservices/postAPI';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const fetchAPI = async (username, password) => {
  try {
    const data = await postAPI({
    username: username,
    password: password
    });

    localStorage.setItem('Token', data.token);
    localStorage.setItem('Role', data.role);
    localStorage.setItem('ID', data._id);
    return data.role;
  } catch (error) {
      console.error(error);
  }
}

function Login() { 
    let navigate = useNavigate() 
    let [ ID, setID ] = useState('');
    let [ password, setPassword ] = useState('');

    useEffect(() => {
      let role = localStorage.getItem('Role')
        if (role === 'admin' || role === 'doctor' || role === 'patient') {
            navigate('/' + role, { replace: true });
        }
    }, [])

    let handleClick = async () => {
        const role = await fetchAPI(ID, password);
        navigate('/' + role, { replace: true });
        console.log(role);
    }

    return <div className={cx('wrapper')}>
        <div className={cx('form')}>
            <label>enter ID: <FormInput inputVal={ID} onChange={e => setID(e.target.value)} /> </label>
            <label>enter password: <FormInput inputVal={password} onChange={e => setPassword(e.target.value)} type="password" /> </label>
            <button onClick={handleClick}>Sign In</button>
        </div>
    </div>;
}

export default Login;