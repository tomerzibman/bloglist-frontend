import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('<BlogForm /> calls event handler with right information when blogs are created', async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);
  const titleInput = screen.getByPlaceholderText('blog title');
  const authorInput = screen.getByPlaceholderText('blog author');
  const urlInput = screen.getByPlaceholderText('blog url');
  const createButton = screen.getByText('create');
  await user.type(titleInput, 'Testing title');
  await user.type(authorInput, 'Testing author');
  await user.type(urlInput, 'www.testingurl.com');
  await user.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('Testing title');
  expect(createBlog.mock.calls[0][0].author).toBe('Testing author');
  expect(createBlog.mock.calls[0][0].url).toBe('www.testingurl.com');
});
