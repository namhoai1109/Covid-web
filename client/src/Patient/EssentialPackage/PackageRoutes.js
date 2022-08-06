import { Route, Routes } from 'react-router-dom';
import configs from '~/config';
import InfoNecessity from '~/Doctor/EssentialItem/InfoNecessity';
import EssentialPackage from './EssentialPackage';
import InfoPackage from './InfoPackage';

function PackageRoutes() {
    return (
        <Routes>
            <Route index element={<EssentialPackage />} />
            <Route path={configs.patientRoutes.infoPackage} element={<InfoPackage />} />
            <Route path={configs.patientRoutes.infoProduct} element={<InfoNecessity viewOnly />} />
        </Routes>
    );
}

export default PackageRoutes;
