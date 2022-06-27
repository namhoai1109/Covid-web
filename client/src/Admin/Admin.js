import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';
import { adminRoutes } from '~/routes';
import { Route, Routes, Navigate } from 'react-router-dom';
import configs from '~/config';

function Admin() {
    return (
        <Layout Header={Header} Sidebar={SideBar}>
            <Routes>
                {adminRoutes.map((route, index) => {
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
