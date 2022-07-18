import { _delete } from '~/utils/httpRequest';

export const deleteAPI = async (url) => {
    try {
        let token = JSON.parse(localStorage.getItem('Token')).token;
        let res = await _delete(url, token);
        return res;
    } catch (err) {
        return err;
    }
};
