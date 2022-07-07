import { useNavigate } from 'react-router-dom';
import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';
import EssentialPackage from './EssentialPackage';
import { useEffect } from 'react';

function Patient() {
    let navigate = useNavigate();

    useEffect(() => {
        let Token = JSON.parse(localStorage.getItem('Token'))
        if (Token === null || Token.role !== 'patient') {
            navigate(-1, { replace: true });
        }
    }, [])
     

    return (
        <Layout Header={Header} Sidebar={SideBar}>
        </Layout>
    );
}

export default Patient;
