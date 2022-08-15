import axios from 'axios';

const request = axios.create({
    baseURL: 'https://localhost:9000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

export const get = async (url) => {
    try {
        let res = await request.get(url);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getParam = async (url, token, params) => {
    try {
        let res = await request.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: params,
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const post = async (url, data, token) => {
    try {
        let res;
        if (token) {
            res = await request.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else {
            res = await request.post(url, data);
        }
        return res.data;
    } catch (error) {
        return error.response.data.message;
    }
};
