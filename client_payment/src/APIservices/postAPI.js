import { post, get } from './httpRequest';

export const postAPI = async (url, data, token = '') => {
    try {
        let res = await post(url, data, token);
        return res;
    } catch (error) {
        return error;
    }
};

export const getAPI = async (url) => {
    try {
        let token = JSON.parse(localStorage.getItem('Token')).token;
        let res = await get(url, token);
        return res;
    } catch (error) {
        return error;
    }
};
