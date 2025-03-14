import { useState, useEffect } from 'react'

import Blog from './components/Blog';
import Login from './components/Login';
import AddBlog from './components/AddBlog';
import Notification from './components/Notification';

import blogService from './services/blogs';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState(null);

	const fetchBlogs = async () => {
		try {
			const response = await blogService.getAll();
			setBlogs(response);
		} catch(error) {
			console.error('Failed to fetch blogs:', error.response?.data?.error || error.message);
		}
	}

	useEffect(() => {
		fetchBlogs();
	}, []);

	 useEffect(() => {
        const loggedUserJSON = localStorage.getItem('loggedUser');

         if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
    }, []);

	 const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

	return (
		<div>
			{!user ? (
				<div>
					<Login setUser={setUser} />
				</div>
			) : (
				<>
				 	<Notification message={notification} />
					<h2>blogs</h2>
					<div>
						<span>{user.username} logged in</span>
						<button onClick={() => setUser(null)}>Logout</button>
					</div>
					<AddBlog 
						setBlogs={setBlogs} 
						showNotification={showNotification}
						fetchBlogs={fetchBlogs} 
					/>
					<br />
					{blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
				</>
			)}
		</div>
	)
}

export default App