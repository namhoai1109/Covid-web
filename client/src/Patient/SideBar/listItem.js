import { MaskIcon } from '~/CommonComponent/icons';
import configs from '~/config';

let listItem = [
    {
        title: 'Essential Package',
        path: configs.mainRoutes.patient + configs.patientRoutes.essentialPackage,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
    {
        title: 'Personal Information',
        path: configs.mainRoutes.patient + configs.patientRoutes.personalInformation,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
    {
        title: 'Management History',
        path: configs.mainRoutes.patient + configs.patientRoutes.managementHistory,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
    {
        title: 'Payment History',
        path: configs.mainRoutes.patient + configs.patientRoutes.paymentHistory,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
    {
        title: 'Bank Account',
        path: configs.mainRoutes.patient + configs.patientRoutes.bankAccount,
        icon: <MaskIcon width="5rem" height="5rem" />,
    },
];

export default listItem;
