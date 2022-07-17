import Admin from '~/Admin';
import Doctor from '~/Doctor';
import Patient from '~/Patient';
import ManagerPage from '~/Admin/ManagerPage';
import FacilityPage from '~/Admin/FacilityPage';
import Login from '~/Login';
import CovidPatient from '~/Doctor/CovidPatient';
import { InputForm, ListPatient } from '~/Doctor/CovidPatient';
import { InputFormNecessity } from '~/Doctor/EssentialItem';
import EssentialItem from '~/Doctor/EssentialItem';
import configs from '~/config';

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
        path: configs.doctorRoutes.covidPatient,
        element: CovidPatient,
    },
    {
        path: configs.doctorRoutes.essentialItem,
        element: EssentialItem,
    },
    {
        path: configs.doctorRoutes.newPatient,
        element: InputForm,
    },
    {
        path: configs.doctorRoutes.listPatient,
        element: ListPatient,
    },
    {
        path: configs.doctorRoutes.newNecessity,
        element: InputFormNecessity,
    },
];
