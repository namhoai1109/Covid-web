export const menuManager = ['Username', 'Name'];
export const menuFacility = ['Name', 'Max no. patient', 'no. patient'];
let makeItemForm = (title, type) => {
    return {
        title,
        type,
    };
};
export const formInputDoctor = [
    makeItemForm('Username', 'input'),
    makeItemForm('Name', 'input'),
    makeItemForm('Password', 'passGen'),
];
export const formInputFacility = [
    makeItemForm('Province/City', 'select'),
    makeItemForm('District/County', 'select'),
    makeItemForm('Ward/Village', 'select'),
    makeItemForm('Name', 'input'),
    makeItemForm('Max no. patient', 'input'),
];

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
