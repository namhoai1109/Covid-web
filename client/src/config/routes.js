export const mainRoutes = {
    login: '/',
    admin: '/admin',
    doctor: '/doctor',
    patient: '/patient',
    paymentGate: '/payment',
};

export const subRoute = '/*';

export const adminRoutes = {
    doctorManagement: '/doctormanagement',
    historyDoctor: '/history',
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
    history: '/history',
    managementHistory: '/management',
    paymentHistory: '/payment',
    consumptionHistory: '/consumption',
    bankAccount: '/bankaccount',
};

export const statisticsRoutes = {
    covidPatient: '/covidpatient',
    status: '/status',
    product: '/product',
    package: '/package',
    payment: '/payment',
};
