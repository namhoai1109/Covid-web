import { getParam } from '~/utils/httpRequest';

export const filterAPI = async (url, valueFilter) => {
    try {
        let params = new URLSearchParams();

        Object.keys(valueFilter).forEach((key) => {
            params.append('filter_by', key.toLowerCase());
            params.append('value', valueFilter[key]);
        });

        let token = JSON.parse(localStorage.getItem('Token')).token;
        const res = await getParam(url, token, params);
        return res;
    } catch (err) {
        return err;
    }
};
