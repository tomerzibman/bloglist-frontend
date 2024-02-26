import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('blog component', () => {
  let container;
  const incrementLikeOf = jest.fn();

  beforeEach(() => {
    const blog = {
      title: 'Some title',
      author: 'Tomer Zibman',
      url: 'www.fake.com',
      likes: 3,
      user: {
        username: 'tomer',
      },
    };
    container = render(
      <Blog blog={blog} incrementLikeOf={incrementLikeOf} />,
    ).container;
  });

  test('renders title and author, but not URL or number of likes', () => {
    const blogDiv = container.querySelector('.blog');
    const detailsDiv = container.querySelector('.details');

    expect(blogDiv).toHaveTextContent('Some title');
    expect(blogDiv).toHaveTextContent('Tomer Zibman');
    expect(blogDiv).toHaveTextContent('www.fake.com');
    expect(blogDiv).toHaveTextContent('3');
    expect(blogDiv).not.toHaveStyle('display: none');
    expect(detailsDiv).toHaveStyle('display: none');
  });

  test('renders url and like count are shown when button is clicked', async () => {
    const detailsDiv = container.querySelector('.details');
    const user = userEvent.setup();
    const showButton = screen.getByText('show');
    await user.click(showButton);

    expect(detailsDiv).not.toHaveStyle('display: none');
    expect(detailsDiv).toHaveTextContent('www.fake.com');
    expect(detailsDiv).toHaveTextContent('3');
  });

  test('calls event handler for incrementing likes twice if it was clicked twice', async () => {
    const detailsDiv = container.querySelector('.details');
    const user = userEvent.setup();
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(incrementLikeOf.mock.calls).toHaveLength(2);
  });
});
