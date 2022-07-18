import { Route, Routes } from 'react-router-dom';
import configs from '~/config';
import CovidPatient from './CovidPatient';
import InfoPatient from './InfoPatient';
import InputForm from './InputForm';

function CovidPatientRoutes() {
    return (
        <Routes>
            <Route index element={<CovidPatient />} />
            <Route path={configs.doctorRoutes.newPatient} element={<InputForm />} />
            <Route path={configs.doctorRoutes.infoPatient} element={<InfoPatient />} />
        </Routes>
    );
}

export default CovidPatientRoutes;
