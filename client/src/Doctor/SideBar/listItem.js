import { MaskIcon } from '~/CommonComponent/icons';
import configs from '~/config';

let listItem = [
    {
        title: 'Covid Patient',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.covidPatient,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
    {
        title: 'Necessity',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
    {
        title: 'Necessity Package',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.essentialPackage,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
    {
        title: 'Statistics',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.statistics,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
    {
        title: 'Payment Management',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.paymentManagement,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
];

export default listItem;
