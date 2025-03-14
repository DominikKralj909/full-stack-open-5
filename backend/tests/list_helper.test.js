const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const api = supertest(app);

const blogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0
	}, {
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0
	}, {
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0
	}, {
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0
	}, {
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0
	}, {
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0
	}  
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
});

describe('total likes', () => {
	const listWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
			likes: 5,
			__v: 0
		}
	];

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog);
		assert.strictEqual(result, 5);
	});

	test('when list has array of blogs, equals the likes of that', () => {
		const result = listHelper.totalLikes(blogs);
		assert.strictEqual(result, 36);
	});

	test('when list of blogs is empty, equals the likes of that', () => {
		const result = listHelper.totalLikes([]);
		assert.strictEqual(result, 0);
	});

	test('returns the blog with most likes', () => {
		const favBlog = { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 };
		
		const result = listHelper.favoriteBlog(blogs);
		assert.deepStrictEqual(result, favBlog);
	});

	test('returns author with most blogs', () => {
		const result = listHelper.mostBlogs(blogs);
		assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 });
	});

	test('returns author with most likes', () => {
		const result = listHelper.mostLikes(blogs);
		assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 });
	});
});

describe('GET /api/blogs', () => {
	test('should return correct number of blogs in JSON format', async () => {
		const response = await api.get('/api/blogs');
		assert.strictEqual(response.status, 200);
		assert.strictEqual(response.type, 'application/json');

		const blogsCount = response.body.length;
		assert(blogsCount >= 6);
  });

	test('unique identifier is named "id"', async () => {
		const response = await api.get('/api/blogs');
		const blog = response.body[0];
		assert(blog.id);
  	});
});

describe('POST /api/blogs', () => {
	test('should create a new blog and increase the blog count', async () => {
		const newBlog = { title: 'New Blog Post', author: 'Test Author', url: 'http://test.com', likes: 10 };

		const initialResponse = await api.get('/api/blogs');
		const initialCount = initialResponse.body.length;

		const response = await api.post('/api/blogs').send(newBlog);

		const updatedResponse = await api.get('/api/blogs');
		const updatedCount = updatedResponse.body.length;

		assert.strictEqual(updatedCount, initialCount + 1);
		assert.strictEqual(response.status, 201);
		assert.deepStrictEqual(response.body.title, newBlog.title);
	});

	test('should default "likes" to 0 if missing', async () => {
		const newBlog = { title: 'Blog without likes', author: 'Test Author', url: 'http://test.com' };

		const response = await api.post('/api/blogs').send(newBlog);
		assert.strictEqual(response.status, 201);
		assert.strictEqual(response.body.likes, 0);
	});

	test('should return 400 if title is missing', async () => {
		const newBlog = { author: 'Test Author', url: 'http://test.com', likes: 5 };

		const response = await api.post('/api/blogs').send(newBlog);
		assert.strictEqual(response.status, 400); 
		assert.strictEqual(response.body.error, 'Title and URL are required');
	});

	test('should return 400 if url is missing', async () => {
		const newBlog = { title: 'Blog without URL', author: 'Test Author', likes: 5 };

		const response = await api.post('/api/blogs').send(newBlog);
		assert.strictEqual(response.status, 400);
		assert.strictEqual(response.body.error, 'Title and URL are required');
	});
});

describe('DELETE /api/blogs/:id', () => {
	test('should delete a blog post and return 204', async () => {
		const newBlog = { title: 'Test Blog to Delete', author: 'Test Author', url: 'http://test.com', likes: 5 };
		const postResponse = await api.post('/api/blogs').send(newBlog);
		const blogId = postResponse.body.id;

		const blogsBeforeDelete = await api.get('/api/blogs');
		const initialBlogCount = blogsBeforeDelete.body.length;

		const deleteResponse = await api.delete(`/api/blogs/${blogId}`);
		assert.strictEqual(deleteResponse.status, 204);

		const blogsAfterDelete = await api.get('/api/blogs');
		assert.strictEqual(blogsAfterDelete.body.length, initialBlogCount - 1);
	});
});

describe('PUT /api/blogs/:id', () => {
	test('should update the likes of a blog post', async () => {
		const newBlog = new Blog({ title: 'Test Blog', author: 'Test Author', url: 'http://test.com', likes: 0 });
		const savedBlog = await newBlog.save();

		const updatedLikes = 10;
		const response = await api.put(`/api/blogs/${savedBlog.id}`).send({ likes: updatedLikes }).expect(200);

		assert.strictEqual(response.body.likes, updatedLikes);

		const updatedBlog = await Blog.findById(savedBlog.id);
		assert.strictEqual(updatedBlog.likes, updatedLikes);
	});
});
