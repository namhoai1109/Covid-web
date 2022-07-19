import * as httpRequest from '~/utils/httpRequest';

export const postAPI = async (url, data, token = '') => {
    try {
        let res = await httpRequest.post(url, data, token);
        return res;
    } catch (error) {
        return error;
    }
};
