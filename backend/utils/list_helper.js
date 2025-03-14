const _ = require('lodash');

const dummy = (blogs) => {
	return 1;
}

const totalLikes = (blogs) => {
	const likesArray = blogs.map((blog) => blog.likes);
	const sum = likesArray.reduce((partialSum, a) => partialSum + a, 0);

	return sum;
};

const favoriteBlog = (blogs) => {
	return blogs.map(({ title, author, likes }) => ({ title, author, likes })).sort((a, b) => (a.likes - b.likes))[blogs.length - 1];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = _.countBy(blogs, 'author');
  const topAuthor = _.maxBy(Object.entries(authorCounts), ([, count]) => count);

  return { author: topAuthor[0], blogs: topAuthor[1] };
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) return null;

	const authorLikes = blogs.reduce((acc, blog) => {
		acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
		return acc;
	}, {});

	const topAuthor = Object.entries(authorLikes).reduce((max, [author, likes]) => {
		return likes > max.likes ? { author, likes } : max;
	}, { author: null, likes: -1 });

	return topAuthor;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }