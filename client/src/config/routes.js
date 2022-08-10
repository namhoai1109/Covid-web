export const mainRoutes = {
    login: '/',
    admin: '/admin',
    doctor: '/doctor',
    patient: '/patient',
};

export const subRoute = '/*';

export const adminRoutes = {
    doctorManagement: '/doctormanagement',
    facilityManagement: '/facilitymanagement',
};

export const doctorRoutes = {
    covidPatient: '/covidpatient',
    essentialItem: '/essentialitem',
    essentialPackage: '/essentialpackage',
    statistics: '/statistics',
    paymentManagement: '/paymentmanagement',
    newPatient: '/newpatient',
    infoPatient: '/infopatient',
    newNecessity: '/newnecessity',
    infoNecessity: '/infonecessity',
    newPackage: '/newpackage',
    infoPackage: '/infopackage',
};

export const patientRoutes = {
    essentialPackage: '/essentialpackage',
    infoPackage: '/info',
    infoProduct: '/infoproduct',
    personalInformation: '/information',
    managementHistory: '/managementhistory',
    paymentHistory: '/paymenthistory',
    bankAccount: '/bankaccount',
};

export const statisticsRoutes = {
    covidPatient: '/covidpatient',
    status: '/status',
    product: '/product',
    package: '/package',
    payment: '/payment',
};
