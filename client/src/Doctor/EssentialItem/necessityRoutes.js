import { Route, Routes } from 'react-router-dom';
import configs from '~/config';
import { InputFormNecessity } from '.';
import EssentialItem from './EssentialItem';
import InfoNecessity from './InfoNecessity';

function NecessityRoutes() {
    return (
        <Routes>
            <Route index element={<EssentialItem />} />
            <Route path={configs.doctorRoutes.newNecessity} element={<InputFormNecessity />} />
            <Route path={configs.doctorRoutes.infoNecessity} element={<InfoNecessity />} />
        </Routes>
    );
}

export default NecessityRoutes;
