import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("calls event handler when new blog is added", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm createBlog={createBlog} />);

  const title = container.querySelector("#blog-title");
  const author = container.querySelector("#blog-author");
  const url = container.querySelector("#blog-url");
  const submitButton = screen.getByText("create");

  await user.type(title, "this is a test blog");
  await user.type(author, "test user");
  await user.type(url, "test.com");
  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
});
