import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';
import { adminRoutes } from '~/routes';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import configs from '~/config';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';

function Admin() {
    let navigate = useNavigate();
    
    useEffect(() => {
        let Token = JSON.parse(localStorage.getItem('Token'))
        if (Token === null || Token.role !== 'admin') {
            navigate(-1, { replace: true });
        }
    }, [])


    return (
        <Provider store={store}>
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
        </Provider>
    );
}

export default Admin;
