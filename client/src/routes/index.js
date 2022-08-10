import Admin from '~/Admin';
import Doctor from '~/Doctor';
import Patient from '~/Patient';
import ManagerPage from '~/Admin/ManagerPage';
import FacilityPage from '~/Admin/FacilityPage';
import Login from '~/Login';
import configs from '~/config';
import CovidPatientRoutes from '~/Doctor/CovidPatient/covidPatientRoutes';
import NecessityRoutes from '~/Doctor/EssentialItem/necessityRoutes';
import EssentialPackageRoutes from '~/Doctor/EssentialPackage/EssentialPackageRoutes';
import StatisticsRoutes from '~/Doctor/Statistics/StatisticsRoutes';
import PatientChart from '~/Doctor/Statistics/PatientChart';
import ProductChart from '~/Doctor/Statistics/ProductChart';
import PackageChart from '~/Doctor/Statistics/PackageChart';
import StatusChart from '~/Doctor/Statistics/StatusChart';
import PaymentChart from '~/Doctor/Statistics/PaymentChart';

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
    {
        path: configs.doctorRoutes.essentialPackage + configs.subRoute,
        element: EssentialPackageRoutes,
    },
    {
        path: configs.doctorRoutes.statistics + configs.subRoute,
        element: StatisticsRoutes,
    },
];

export const statisticsRoutes = [
    {
        path: configs.statisticsRoutes.covidPatient,
        element: PatientChart,
    },
    {
        path: configs.statisticsRoutes.product,
        element: ProductChart,
    },
    {
        path: configs.statisticsRoutes.package,
        element: PackageChart,
    },
    {
        path: configs.statisticsRoutes.status,
        element: StatusChart,
    },
    {
        path: configs.statisticsRoutes.payment,
        element: PaymentChart,
    },
];
