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
    listPatient: '/listpatient',
};

export const patientRoutes = {
    essentialPackage: '/essentialpackage',
    personalInformation: '/personalinformation',
    managementHistory: '/managementhistory',
    paymentHistory: '/paymenthistory',
    bankAccount: '/bankaccount',
};
