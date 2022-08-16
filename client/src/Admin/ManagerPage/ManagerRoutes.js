import { Route, Routes } from 'react-router-dom';
import configs from '~/config';
import HistoryDoctor from './HistoryDoctor';
import ManagerPage from './ManagerPage';

function ManagerRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ManagerPage />} />
            <Route path={configs.adminRoutes.historyDoctor} element={<HistoryDoctor />} />
        </Routes>
    );
}

export default ManagerRoutes;
