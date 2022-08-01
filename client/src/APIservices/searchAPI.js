import { getParam } from '~/utils/httpRequest';

export const searchAPI = async (url, valueSearch) => {
    try {
        let token = JSON.parse(localStorage.getItem('Token')).token;
        const res = await getParam(url, token, {
            value: valueSearch,
        });
        return res;
    } catch (err) {
        return err;
    }
};
