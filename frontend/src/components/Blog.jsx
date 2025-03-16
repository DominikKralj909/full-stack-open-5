import { useState } from 'react';

import blogService from '../services/blogs';

const Blog = ({ blog, setBlogs, user }) => {
	const [visible, setVisible] = useState(false);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	};

	
	const handleLike = async () => {
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

	const handleDelete = async () => {
		const confirmDelete = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`);
		if (confirmDelete) {
			try {
				await blogService.deleteBlog(blog.id);
				setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));
			} catch (error) {
				console.error('Error deleting blog:', error.response?.data?.error || error.message);
			}
		}
	};

	const canDelete = user && blog.user.username === user.username;


	return (
		<div style={blogStyle}>
			{blog.title} {blog.author}
			<button onClick={() => setVisible((prevVisible) => !prevVisible)}>
				{visible ? 'Hide' : 'View'}
			</button>
			{visible && (
				<ul>
					<li>{blog.url}</li>
					<li>
						{blog.likes}
						 <button onClick={handleLike}>Like</button>
					</li>
					<li>{blog.user.name}</li>
					{canDelete && <button onClick={handleDelete}>Delete</button>}
				</ul>
			)}
		</div>  
	);
};

export default Blog