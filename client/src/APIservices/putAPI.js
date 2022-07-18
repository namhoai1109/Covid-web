import { put } from '~/utils/httpRequest';

export const putAPI = async (url, data) => {
    try {
        let token = JSON.parse(localStorage.getItem('Token')).token;
        let res = await put(url, data, token);
        return res;
    } catch (err) {
        return err;
    }
};
