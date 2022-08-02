import { Route, Routes } from 'react-router-dom';
import configs from '~/config';
import EssentialPackage from './EssentialPackage';
import InfoPackageRoutes from './InfoPackageRoutes';
import InputPackage from './InputPackage';

function EssentialPackageRoutes() {
    return (
        <Routes>
            <Route index element={<EssentialPackage />} />
            <Route path={configs.doctorRoutes.newPackage} element={<InputPackage />} />
            <Route path={configs.doctorRoutes.infoPackage + configs.subRoute} element={<InfoPackageRoutes />} />
        </Routes>
    );
}

export default EssentialPackageRoutes;
