import { Route, Routes } from 'react-router-dom';
import configs from '~/config';
import EssentialPackage from './EssentialPackage';
import InputPackage from './InputPackage';

function EssentialPackageRoutes() {
    return (
        <Routes>
            <Route index element={<EssentialPackage />} />
            <Route path={configs.doctorRoutes.newPackage} element={<InputPackage />} />
        </Routes>
    );
}

export default EssentialPackageRoutes;
