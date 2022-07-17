import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';
import { doctorRoutes } from '~/routes';
import configs from '~/config';
import { Provider } from 'react-redux';
import store from './redux/store';

function Doctor() {
    let navigate = useNavigate();

    useEffect(() => {
        let Token = JSON.parse(localStorage.getItem('Token'));
        if (Token === null || Token.role !== 'doctor') {
            navigate(-1, { replace: true });
        }
    }, []);

    return (
        <Provider store={store}>
            <Layout Header={Header} Sidebar={SideBar}>
                <Routes>
                    {doctorRoutes.map((route, index) => {
                        let Page = route.element;
                        return <Route key={index} path={route.path} element={<Page />} />;
                    })}
                    <Route
                        path="/"
                        element={
                            <Navigate to={configs.mainRoutes.doctor + configs.doctorRoutes.covidPatient} replace />
                        }
                    />
                </Routes>
            </Layout>
        </Provider>
    );
}

export default Doctor;
