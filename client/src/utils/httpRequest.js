import axios from 'axios';

const request = axios.create({
    baseURL: 'https://localhost:5000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

export const get = async (url, token) => {
    try {
        let res = await request.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
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

export const postForm = async (url, data, token) => {
    try {
        let res = await request.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                ContentType: 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        return error.response.data.message;
    }
};

export const _delete = async (url, token) => {
    try {
        let res = await request.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const put = async (url, data, token) => {
    try {
        let res = await request.put(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const putNoData = async (url, token) => {
    try {
        let res = await request.put(
            url,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        return error;
    }
};
