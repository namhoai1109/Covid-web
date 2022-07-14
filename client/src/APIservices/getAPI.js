import * as httpRequest from '~/utils/httpRequest';

export const getAPI = async (url) => {
    try {
        let token = JSON.parse(localStorage.getItem('Token')).token;
        let res = await httpRequest.get(url, token);
        return res;
    } catch (err) {
        return err
    }
}
