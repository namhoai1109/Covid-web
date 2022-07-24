import Admin from '~/Admin';
import Doctor from '~/Doctor';
import Patient from '~/Patient';
import ManagerPage from '~/Admin/ManagerPage';
import FacilityPage from '~/Admin/FacilityPage';
import Login from '~/Login';
import configs from '~/config';
import CovidPatientRoutes from '~/Doctor/CovidPatient/covidPatientRoutes';
import NecessityRoutes from '~/Doctor/EssentialItem/necessityRoutes';

export const mainRoutes = [
    {
        path: configs.mainRoutes.login,
        element: Login,
    },
    {
        path: configs.mainRoutes.admin + configs.subRoute,
        element: Admin,
    },
    {
        path: configs.mainRoutes.doctor + configs.subRoute,
        element: Doctor,
    },
    {
        path: configs.mainRoutes.patient + configs.subRoute,
        element: Patient,
    },
];

export const adminRoutes = [
    {
        path: configs.adminRoutes.doctorManagement,
        element: ManagerPage,
    },
    {
        path: configs.adminRoutes.facilityManagement,
        element: FacilityPage,
    },
];

export const doctorRoutes = [
    {
        path: configs.doctorRoutes.covidPatient + configs.subRoute,
        element: CovidPatientRoutes,
    },
    {
        path: configs.doctorRoutes.essentialItem + configs.subRoute,
        element: NecessityRoutes,
    },
];
