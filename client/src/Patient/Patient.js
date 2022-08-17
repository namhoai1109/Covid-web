import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';
import { useEffect } from 'react';
import Info from './Info';
import PackageRoutes from './EssentialPackage';
import configs from '~/config';
import { Provider } from 'react-redux';
import store from './redux/store';
import HistoryRoutes from './History/HistoryRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Patient() {
    let navigate = useNavigate();

    useEffect(() => {
        let Token = JSON.parse(localStorage.getItem('Token'));
        if (Token === null || Token.role !== 'patient') {
            navigate(-1, { replace: true });
        }

        //toast.warn('Nap tien di con di lon!!!');
    }, []);

    return (
        <Provider store={store}>
            <Layout Header={Header} Sidebar={SideBar}>
                <ToastContainer />
                <Routes>
                    <Route
                        index
                        path={configs.patientRoutes.essentialPackage + configs.subRoute}
                        element={<PackageRoutes />}
                    />
                    <Route path={configs.patientRoutes.personalInformation} element={<Info />} />
                    <Route path={configs.patientRoutes.history + configs.subRoute} element={<HistoryRoutes />} />
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
