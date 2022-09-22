import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('renders only blog title and author', () => {
  const blog = {
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

  const handleRemove = jest.fn();
  const updateLike = jest.fn();
  const likes = blog.likes;

  render(<Blog blog={blog} handleRemove={handleRemove} likes={likes} updateLike={updateLike} owner={blog.user} />);

  const element = screen.getByText('Test title - Test author');

  expect(element).toBeDefined();
});