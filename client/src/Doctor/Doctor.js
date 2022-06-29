import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';

function Doctor() {
    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('Role') !== 'doctor') {
            navigate(-1, { replace: true });
        }
    }, [])

    return (
        <Layout Header={Header} Sidebar={SideBar}>
            Doctor
        </Layout>
    );
}

export default Doctor;
