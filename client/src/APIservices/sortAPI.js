import { getParam } from '~/utils/httpRequest';

export const sortAPI = async (url, sortParam) => {
    try {
        let token = JSON.parse(localStorage.getItem('Token')).token;
        const res = await getParam(url, token, sortParam);
        return res;
    } catch (err) {
        return err;
    }
};
