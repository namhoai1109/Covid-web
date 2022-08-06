import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';
import { useEffect } from 'react';
import Info from './Info';
import PackageRoutes from './EssentialPackage';
import configs from '~/config';
import { Provider } from 'react-redux';
import store from './redux/store';

function Patient() {
    let navigate = useNavigate();
    let localtion = useLocation();

    useEffect(() => {
        let Token = JSON.parse(localStorage.getItem('Token'));
        if (Token === null || Token.role !== 'patient') {
            navigate(-1, { replace: true });
        }
    }, []);

    return (
        <Provider store={store}>
            <Layout Header={Header} Sidebar={SideBar}>
                <Routes>
                    <Route
                        index
                        path={configs.patientRoutes.essentialPackage + configs.subRoute}
                        element={<PackageRoutes />}
                    />
                    <Route path={configs.patientRoutes.personalInformation} element={<Info />} />
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={configs.mainRoutes.patient + configs.patientRoutes.essentialPackage}
                                replace
                            />
                        }
                    />
                </Routes>
            </Layout>
        </Provider>
    );
}

export default Patient;
