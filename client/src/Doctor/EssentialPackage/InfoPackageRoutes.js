import { Route, Routes } from 'react-router-dom';
import configs from '~/config';
import InfoNecessity from '../EssentialItem/InfoNecessity';
import InfoPackage from './InfoPackage';

function InfoPackageRoutes() {
    return (
        <Routes>
            <Route index element={<InfoPackage />} />
            <Route path={configs.doctorRoutes.infoNecessity} element={<InfoNecessity viewOnly />} />
        </Routes>
    );
}

export default InfoPackageRoutes;
