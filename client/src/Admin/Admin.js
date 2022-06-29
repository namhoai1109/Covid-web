import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';
import { adminRoutes } from '~/routes';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import configs from '~/config';
import { useEffect } from 'react';

function Admin() {
    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('Role') !== 'admin') {
            navigate(-1, { replace: true });
        }
    }, [])

    return (
        <Layout Header={Header} Sidebar={SideBar}>
            <Routes>
                {adminRoutes.map((route) => {
                    const Page = route.element;
                    return <Route key={route.path} path={route.path} element={<Page />} />;
                })}
                <Route
                    path="/"
                    element={<Navigate to={configs.mainRoutes.admin + configs.adminRoutes.doctorManagement} replace />}
                />
            </Routes>
        </Layout>
    );
}

export default Admin;
