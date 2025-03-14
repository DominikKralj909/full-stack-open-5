import axios from 'axios';

const baseUrl = '/api/blogs';
const loginUrl = '/api/login';

let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

const login = async (credentials) => {
	const response = await axios.post(loginUrl, credentials);
	return response.data;
};

const addBlog = async (blog) => {
    const config = {
        headers: { Authorization: token },
    };

    const response = await axios.post(baseUrl, blog, config);
    return response.data;
};

export default { getAll, login, addBlog, setToken };