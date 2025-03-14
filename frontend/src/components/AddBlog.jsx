import { useState } from 'react';

import blogService from '../services/blogs';

function AddBlog({ setBlogs, showNotification, fetchBlogs }) {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const handleAddBlog = async (event) => {
		event.preventDefault();

		try {
			const returnedBlog = await blogService.addBlog({ title, author, url });

			showNotification(`Blog "${title}" added successfully!`, 'success');
			setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog));

			fetchBlogs();
			setTitle('');
			setAuthor('');
			setUrl('');
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
						value={title}
						onChange={(event) => setTitle(event.target.value)} 
					/>
				</div>
				<div>
					author:
					<input 
						type="text" 
						name="author"
						value={author}
						onChange={(event) => setAuthor(event.target.value)} 
					/>
				</div>
				<div>
					url:
					<input 
						type="text" 
						name="url"
						value={url}
						onChange={(event) => setUrl(event.target.value)} 
					/>
				</div>
				<input type="submit" name="create" />
			</form>
		</>
	);

};

export default AddBlog;