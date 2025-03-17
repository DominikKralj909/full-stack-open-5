// blog.test.js
const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
	beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173')
	})

	test('Login form is shown', async ({ page }) => {
		const loginForm = await page.locator('form#login');
		await expect(loginForm).toBeVisible();
	});
});

describe('Login', () => {
	beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173')
	});


	test('succeeds with correct credentials', async ({ page }) => {
		await page.fill('input[name="username"]', 'dominikkralj');
		await page.fill('input[name="password"]', '123');
		await page.click('input[type="submit"]');
		await expect(page.locator('h1')).toContainText('Blog List');
	});

	test('fails with wrong credentials', async ({ page }) => {
		await page.fill('input[name="username"]', 'wronguser');
		await page.fill('input[name="password"]', 'wrongpassword');
		await page.click('input[type="submit"]');
		await expect(page.locator('.notification')).toContainText('Invalid credentials');
	});
});

describe('When logged in', () => {
	beforeEach(async ({ page, request }) => {
		await request.post('/api/testing/reset');
		const user = { username: 'dominikkralj', password: '123' };
		await request.post('/api/users', { data: user });

		await page.goto('/');
		await page.fill('input[name="username"]', 'dominikkralj');
		await page.fill('input[name="password"]', '123');
		await page.click('input[type="submit"]');
	});

	test('a new blog can be created', async ({ page }) => {
		await page.click('text="Create new blog"');
		await page.fill('input[name="title"]', 'Test Blog');
		await page.fill('input[name="author"]', 'Test Author');
		await page.fill('input[name="url"]', 'https://testurl.com');
		await page.click('input[type="submit"]');

		await page.waitForSelector('.blog-title');

		await expect(page.locator('.blog-title').last()).toContainText('Test Blog');
		await expect(page.locator('.blog-author').last()).toContainText('Test Author');
	});

	test('a blog can be liked', async ({ page }) => {
		await page.click('text="Create new blog"');
		await page.fill('input[name="title"]', 'Test Blog');
		await page.fill('input[name="author"]', 'Test Author');
		await page.fill('input[name="url"]', 'https://testurl.com');
		await page.click('input[type="submit"]');

  		await page.waitForSelector('.blog-title');

		const lastBlog = page.locator('.blog-title').last();
		await lastBlog.scrollIntoViewIfNeeded();

		const viewButton = lastBlog.locator('xpath=following-sibling::button[contains(text(), "View")]');
		await viewButton.click();

		const likeButton = page.locator('.like-button');
		await expect(likeButton).toBeVisible();

		const initialLikesText = await page.locator('.blog-likes').textContent();
		const initialLikes = parseInt(initialLikesText, 10);

		await likeButton.click();
		await page.waitForTimeout(500);

		const updatedLikesText = await page.locator('.blog-likes').textContent();
		const updatedLikes = parseInt(updatedLikesText, 10);

		expect(updatedLikes).toBe(initialLikes + 1); 
	});

	test('a user can delete their own blog', async ({ page }) => {
		await page.click('text="Create new blog"');
		await page.fill('input[name="title"]', 'Test Blog to Delete');
		await page.fill('input[name="author"]', 'Test Author');
		await page.fill('input[name="url"]', 'https://testurl.com');
		await page.click('input[type="submit"]');

		const newBlogTitle = 'Test Blog to Delete';
		const newBlog = page.locator(`.blog-title:has-text("${newBlogTitle}")`);
		await expect(newBlog).toBeVisible();

		const viewButton = newBlog.locator('xpath=following-sibling::button[contains(text(), "View")]');
		await viewButton.click();

		const deleteButton = page.locator('button:has-text("Delete")');
		await expect(deleteButton).toBeVisible();

		page.on('dialog', async dialog => {
			expect(dialog.message()).toBe(`Remove blog "${newBlogTitle}" by Test Author?`);
			await dialog.accept();
		});

		await deleteButton.click();

		await expect(newBlog).not.toBeVisible();
	});

	test('a user cannot see the delete button for a blog they did not create', async ({ page }) => {
		await page.goto('http://localhost:5173');
		await page.fill('input[name="username"]', 'dominikkralj');
		await page.fill('input[name="password"]', '123');
		
		const submitButton = page.locator('input[type="submit"][value="Login"]');
		await expect(submitButton).toBeVisible();
		await submitButton.click();

    	const blogContainer = page.locator('div.blog-entry')
			.filter({ hasText: 'New Blog Post' })
			.filter({ hasText: 'Test Author' })
			.first(); 

    	await expect(blogContainer).toBeVisible();

		const viewButton = blogContainer.locator('button:has-text("View")');
		await viewButton.click();

		const deleteButton = blogContainer.locator('button:has-text("Delete")');
		await expect(deleteButton).not.toBeVisible();
	});

	test('blogs are arranged in descending order based on likes', async ({ page }) => {
   		await page.goto('http://localhost:5173');
		await page.fill('input[name="username"]', 'dominikkralj');
		await page.fill('input[name="password"]', '123');
		
		const submitButton = page.locator('input[type="submit"][value="Login"]');
		await expect(submitButton).toBeVisible();
		await submitButton.click();

		await page.waitForSelector('.blog-title');

		const blogContainers = await page.locator('.blog-entry').all();

		for (const blog of blogContainers) {
			await blog.locator('button:has-text("View")').click();
		}

		await page.waitForTimeout(500);

		const likeCounts = await Promise.all(
			blogContainers.map(async (blog) => {
				const likeText = await blog.locator('.blog-likes').textContent();
				return parseInt(likeText.match(/\d+/)[0], 10);
			})
		);

		const sortedLikes = [...likeCounts].sort((a, b) => b - a);
		expect(likeCounts).toEqual(sortedLikes);
	});
});

