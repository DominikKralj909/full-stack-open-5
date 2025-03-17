import { useState, useEffect } from 'react'

import Blog from './components/Blog';
import Login from './components/Login';
import AddBlog from './components/AddBlog';
import Notification from './components/Notification';
import Toggleable from './components/Toggleble';

import blogService from './services/blogs';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState(null);
	const [visible, setVisible] = useState(false);

	const fetchBlogs = async () => {
		try {
			const response = await blogService.getAll();
			const sortedBlogs = response.sort((a, b) => b.likes - a.likes);
			setBlogs(sortedBlogs);
		} catch (error) {
			console.error('Failed to fetch blogs:', error.response?.data?.error || error.message);
		}
	};

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

	const handleLike = async (blog) => {
			try {
				const updatedBlog = await blogService.updateBlog(blog.id, {
					title: blog.title,
					author: blog.author,
					url: blog.url,
					likes: blog.likes + 1,
					user: blog.user.id
				});
	
				setBlogs((prevBlogs) => [...prevBlogs.map(b => (b.id === blog.id ? updatedBlog : b))].sort((a, b) => b.likes - a.likes));
			} catch (error) {
				console.error('Error liking blog:', error.response?.data?.error || error.message);
			}
	};
	
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
					<button onClick={() => setVisible(true)}>New note</button>
					<br />
					<Toggleable 
						visible={visible}
						setVisible={setVisible}
					>
						<AddBlog 
							setBlogs={setBlogs} s
							showNotification={showNotification}
							fetchBlogs={fetchBlogs}
							setVisible={setVisible} 
						/>
					</Toggleable>
					<br />
					{blogs.map(blog => <Blog key={blog.id} blog={blog} setBlogs={setBlogs} user={user} onLike={handleLike} />)}
				</>
			)}
		</div>
	)
}

export default App