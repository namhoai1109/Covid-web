import { postForm } from '~/utils/httpRequest';

export const postFormAPI = async (url, data) => {
    try {
        let token = JSON.parse(localStorage.getItem('Token')).token;
        let res = await postForm(url, data, token);
        return res;
    } catch (error) {
        return error;
    }
};
