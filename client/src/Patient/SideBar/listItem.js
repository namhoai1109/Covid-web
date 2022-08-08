import { faBoxArchive, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import configs from '~/config';

let listItem = [
    {
        title: 'Package',
        path: configs.mainRoutes.patient + configs.patientRoutes.essentialPackage,
        icon: <FontAwesomeIcon icon={faBoxArchive} />,
    },
    {
        title: 'Information',
        path: configs.mainRoutes.patient + configs.patientRoutes.personalInformation,
        icon: <FontAwesomeIcon icon={faUserGear} />,
    },
    // {
    //     title: 'Management History',
    //     path: configs.mainRoutes.patient + configs.patientRoutes.managementHistory,
    //     icon: <MaskIcon width="5rem" height="5rem" />,
    // },
    // {
    //     title: 'Payment History',
    //     path: configs.mainRoutes.patient + configs.patientRoutes.paymentHistory,
    //     icon: <MaskIcon width="5rem" height="5rem" />,
    // },
    // {
    //     title: 'Bank Account',
    //     path: configs.mainRoutes.patient + configs.patientRoutes.bankAccount,
    //     icon: <MaskIcon width="5rem" height="5rem" />,
    // },
];

export default listItem;
