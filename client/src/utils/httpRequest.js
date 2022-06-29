import axios from "axios";

const requestPost = axios.create({
    baseURL: "http://localhost:5000/",
    headers: {
        "Content-Type": "application/json"
    }
});

export const post = async (url, data) => {
    try {
        let res = await requestPost.post(url, data);   
        return res.data;
    } catch (error) {
        return error.response.data.message;
    }
}