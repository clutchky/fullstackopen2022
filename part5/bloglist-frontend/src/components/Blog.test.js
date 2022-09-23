import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  let blog, handleRemove, updateLike, container;

  beforeEach(() => {
    blog = {
      title: 'Test title',
      author:'Test author',
      url: 'testurl.com',
      likes: 1,
      user: {
        username: 'test',
        name: 'test',
        id: 'test123'
      },
      id: 'test123'
    };

    handleRemove = jest.fn();
    updateLike = jest.fn();

    container = render(
      <Blog
        blog={blog}
        handleRemove={handleRemove}
        likes={blog.likes}
        updateLike={updateLike}
        owner={blog.user}
      />
    ).container;
  });

  test('renders only blog title and author', () => {
    const element = screen.getByText('Test title - Test author');

    expect(element).toBeDefined();
  });

  test('when view button is clicked, blog url and likes are displayed', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const blogDetails = container.querySelector('.blogDetails');
    expect(blogDetails).toHaveStyle('display: block');
  });
});