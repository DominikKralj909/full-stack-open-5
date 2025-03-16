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

const updateBlog = async (id, updatedBlog) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedBlog);
    return response.data;
};

const deleteBlog = async (id) => {
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };

    await axios.delete(`/api/blogs/${id}`, config);
};

export default { getAll, login, addBlog, setToken, updateBlog, deleteBlog };