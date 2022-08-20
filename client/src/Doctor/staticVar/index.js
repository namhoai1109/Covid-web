import configs from '~/config';

export const patientFields = ['ID number', 'Name', 'DoB', 'Status', 'Facility'];
export const patientSortFilter = ['ID number', 'Name', 'DoB', 'Status'];

export const necessityFields = ['Name', 'Price', 'Quantity unit'];
export const necessitySortFilter = ['Name', 'Price', 'Quantity unit', 'Type'];
export const filterPrice = [
    { interface: '< 200k', value: 'lt-200' },
    { interface: '200k - 500k', value: '200-500' },
    { interface: '500k - 1M', value: '500-1000' },
    { interface: '1M - 2M', value: '1000-2000' },
    { interface: '2M - 5M', value: '2000-5000' },
    { interface: '> 5M', value: 'gt-5000' },
];

// - 'lt-200': price < 200000
// - '200-500': price between 200000 and 500000
// - '500-1000': price between 500000 and 1000000
// - '1000-2000': price between 1000000 and 2000000
// - '2000-5000': price between 2000000 and 5000000
// - 'gt-5000': price > 5000000
export const essentialPackageFields = ['Name', 'Time limit'];
export const typeNecessity = ['Drug', 'Supply', 'Food', 'Dietary Supplement', 'Protection', 'Herbal Medicine', 'Other'];
export const inputField1 = ['Name', 'ID number', 'Year of birth', 'Password'];
export const inputField2 = ['Province/City', 'District/County', 'Ward/Village'];
export const unitTime = ['day', 'week', 'month'];
export const packageFields = ['Name', 'Price', 'Quantity unit', 'Limit'];

const Province = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
const District = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4'];
const Ward = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4'];
const Facility = ['Cơ sở 1', 'Cơ sở 2', 'Cơ sở 3', 'Cơ sở 4'];
export const dataAddress = {
    Province,
    District,
    Ward,
    Facility,
};

export const Status = ['F0', 'F1', 'F2', 'F3'];

export const NavStatistic = [
    {
        name: 'Patient',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.covidPatient,
    },
    {
        name: 'Product',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.product,
    },
    {
        name: 'Package',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.package,
    },
    {
        name: 'Status',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.status,
    },
    {
        name: 'Payment',
        path: configs.mainRoutes.doctor + configs.doctorRoutes.statistics + configs.statisticsRoutes.payment,
    },
];
