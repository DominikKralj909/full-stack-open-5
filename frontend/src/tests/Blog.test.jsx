import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Blog from '../components/Blog';

const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User' }
};

describe('Blog component', () => {
    test('renders title and author, but not URL or likes by default', () => {
        render(<Blog blog={blog} />);

        expect(screen.getByText('Test Blog Test Author')).toBeDefined();
        expect(screen.queryByText('http://testurl.com')).toBeNull();
        expect(screen.queryByText('5')).toBeNull();
    });

    test('shows URL and number of likes when "View" button is clicked', async () => {
        render(<Blog blog={blog} />);
        const user = userEvent.setup();

        const viewButton = screen.getByText('View');
        await user.click(viewButton);

        expect(screen.getByText('http://testurl.com')).toBeDefined();
        expect(screen.getByText('5')).toBeDefined();
    });

    test('clicking the like button twice calls event handler twice', async () => {
        const mockHandleLike = vi.fn();
        render(<Blog blog={blog} setBlogs={() => {}} user={{ username: 'Test User' }} onLike={mockHandleLike} />);

        const user = userEvent.setup();

        const viewButton = screen.getByText('View');
        await user.click(viewButton);

        const likeButton = screen.getByText('Like');
        await user.click(likeButton);
        await user.click(likeButton);

        expect(mockHandleLike).toHaveBeenCalledTimes(2);
    });

});
