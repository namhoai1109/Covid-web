import { faBedPulse, faBoxArchive, faChartPie, faFileInvoiceDollar, faPills } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import configs from '~/config';

let listItem = [
    {
        title: 'Covid Patient',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.covidPatient,
        icon: <FontAwesomeIcon icon={faBedPulse} />,
    },
    {
        title: 'Product',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.essentialItem,
        icon: <FontAwesomeIcon icon={faPills} />,
    },
    {
        title: 'Package',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.essentialPackage,
        icon: <FontAwesomeIcon icon={faBoxArchive} />,
    },
    {
        title: 'Statistics',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.statistics,
        icon: <FontAwesomeIcon icon={faChartPie} />,
    },
    {
        title: 'Payment',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.paymentManagement,
        icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
    },
];

export default listItem;
