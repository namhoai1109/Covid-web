import axios from "axios";

const request = axios.create({
    baseURL: "http://localhost:5000/api/",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 5000
});

export const post = async (url, data) => {
    try {
        let res = await request.post(url, data);   
        return res.data;
    } catch (error) {
        return error.response.data.message;
    }
}