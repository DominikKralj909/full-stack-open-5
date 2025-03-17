
import PropTypes from 'prop-types';
import { useState } from 'react';

import blogService from '../services/blogs';

const Blog = ({ blog, setBlogs, user, onLike }) => {
	const [visible, setVisible] = useState(false);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
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
		<div style={blogStyle} className="blog-entry">
			<span className="blog-title">{blog.title}</span>
			<span className="blog-author">{blog.author}</span>
			<button onClick={() => setVisible((prevVisible) => !prevVisible)}>
				{visible ? 'Hide' : 'View'}
			</button>
			{visible && (
				<ul>
					<li>{blog.url}</li>
					<li>
						 <span className="blog-likes">{blog.likes}</span>
						 <button className="like-button" onClick={() => onLike(blog)}>Like</button>
					</li>
					<li>{blog.user.name}</li>
					{canDelete && <button onClick={handleDelete} value="Delete">Delete</button>}
				</ul>
			)}
		</div>  
	);
};


Blog.propTypes = {
	blog: PropTypes.shape({
		title: PropTypes.string.isRequired,
		author: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
		likes: PropTypes.number.isRequired,
		user: PropTypes.shape({
			name: PropTypes.string.isRequired
		}).isRequired
	}).isRequired
};

export default Blog;