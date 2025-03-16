import { useState } from 'react';

import blogService from '../services/blogs';

function AddBlog({ setBlogs, showNotification, fetchBlogs, setVisible }) {
	const [blog, setBlog] = useState({
		title: '',
		author: '',
		url: '',
	});
 
	const handleAddBlog = async (event) => {
		event.preventDefault();

		try {
			const returnedBlog = await blogService.addBlog({ title: blog.title, author: blog.author, url: blog.url });

			showNotification(`Blog "${blog.title}" added successfully!`, 'success');
			setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog));

			fetchBlogs();
			setBlog({ title: '', author: '', url: '' });
			setVisible(false); 
		} catch (error) {
			console.error('Failed to add a blog:', error.response?.data?.error || error.message);
			showNotification(`Error adding blog: ${error.response?.data?.error || error.message}`, 'error');
		}
	};


	return(
		<>
			<h2>create new</h2>
			<form onSubmit={handleAddBlog}>
				<div>
					title:
					<input 
						type="text" 
						name="title"
						value={blog.title}
						onChange={(event) => setBlog((prevBlog) => ({ ...prevBlog, title: event.target.value }))} 
					/>
				</div>
				<div>
					author:
					<input 
						type="text" 
						name="author"
						value={blog.author}
						onChange={(event) => setBlog((prevBlog) => ({ ...prevBlog, author: event.target.value }))} 
					/>
				</div>
				<div>
					url:
					<input 
						type="text" 
						name="url"
						value={blog.url}
						onChange={(event) => setBlog((prevBlog) => ({ ...prevBlog, url: event.target.value }))} 
					/>
				</div>
				<input type="submit" name="create" />
				<button onClick={() => setVisible(false)}>Cancel</button>
			</form>
		</>
	);

};

export default AddBlog;