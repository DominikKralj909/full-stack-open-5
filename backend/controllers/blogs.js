const express = require('express');
const blogsRouter = express.Router();

const Blog = require('../models/blog');
const User = require('../models/user');

const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
        response.json(blogs);
    } catch (error) {
        response.status(500).json({ error: 'Something went wrong' });
    }
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const { title, author, url, likes } = request.body;

    // Get the logged-in user from middleware
    const user = request.user;

    if (!user) {
        return response.status(401).json({ error: 'Unauthorized: user not found' });
    }

    if (!title || !url) {
        return response.status(400).json({ error: 'Title and URL are required' });
    }

    // Create new blog with correct user
    const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id, // Associate with the logged-in user
    });

    const savedBlog = await blog.save();

    // Add blog to the user's blogs array
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
	const { id } = request.params;

	try {
		const blogToDelete = await Blog.findById(id);

		if (!blogToDelete) {
			return response.status(404).json({ error: 'Blog not found' });
		}

		await Blog.findByIdAndDelete(id);
		response.status(204).end();

	} catch (error) {
		response.status(400).json({ error: 'Invalid ID format' });
	}
});

blogsRouter.put('/:id', async (request, response) => {
	const { id } = request.params;
	const { likes } = request.body;


	try {
		const blogToUpdate = await Blog.findById(id);

		if (!blogToUpdate) {
			return response.status(404).json({ error: 'Blog not found' });
		}

		if (likes !== undefined) {
			blogToUpdate.likes = likes;
		}

		const updatedBlog = await blogToUpdate.save();

		response.json(updatedBlog);

	} catch (error) {
		response.status(500).json({ error: 'Something went wrong' });
	}
});


module.exports = blogsRouter
