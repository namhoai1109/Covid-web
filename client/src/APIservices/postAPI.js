import * as httpRequest from '~/utils/httpRequest';

export const postAPI = async (data) => {
    try {
        let res = await httpRequest.post('/auth/login', data);
        return res;
    } catch (error) {
        return error;
    }
}