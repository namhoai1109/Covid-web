import { search } from '~/utils/httpRequest';

export const searchAPI = async (url, filter_by, value) => {
    try {
        let params = {
            filter_by: filter_by.toLowerCase(),
            value: value,
        };

        if (filter_by === '') {
            delete params.filter_by;
        }
        //console.log(params);
        let token = JSON.parse(localStorage.getItem('Token')).token;
        const res = await search(url, token, params);

        return res;
    } catch (err) {
        return err;
    }
};
