import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let blog;

  beforeEach(() => {
    blog = {
      title: "Test title",
      author: "Test author",
      url: "testurl.com",
      likes: 1,
      user: {
        username: "test",
        name: "test",
        id: "test123",
      },
      id: "test123",
    };
  });

  test("renders only blog title and author", () => {
    render(<Blog blog={blog} />);

    const element = screen.getByText("Test title - Test author");

    expect(element).toBeDefined();
  });

  test("when view button is clicked, blog url and likes are displayed", async () => {
    const handleClick = jest.fn();

    const container = render(
      <div>
        {blog.title} - {blog.author} <button onClick={handleClick}>view</button>
        <br />
        <div className="blogDetails">
          {blog.url}
          <br />
          likes {blog.likes};
        </div>
      </div>
    ).container;

    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const blogDetails = container.querySelector(".blogDetails");

    expect(handleClick.mock.calls).toHaveLength(1);
    expect(blogDetails).not.toHaveStyle("display: none");
  });
});

describe("<BlogDetails />", () => {
  test("when like button is clicked twice, updateLike method is called twice", async () => {
    const blog = {
      title: "Test title",
      author: "Test author",
      url: "testurl.com",
      likes: 1,
      user: {
        username: "test",
        name: "test",
        id: "test123",
      },
      id: "test123",
    };

    const handleLike = jest.fn();

    render(
      <div className="blogDetails">
        {blog.url}
        <br />
        likes {blog.likes} <button onClick={handleLike}>like</button>
        <br />
        {blog.user.name}
        <br />
      </div>
    );

    const user = userEvent.setup();
    const button = screen.getByText("like");
    await user.click(button);
    await user.click(button);

    expect(handleLike.mock.calls).toHaveLength(2);
  });
});
