import React from "react";
import Blog from "./Blog";
import Togglable from "./Togglable";
import BlogSubmit from "./BlogSubmit";

import {
    Box,
    Container,
    Table,
    TableBody,
    TableContainer,
    Paper,
  } from '@mui/material'

const BlogList = ({
  handlePost,
  handleUpdate,
  handleLike,
  handleDelete,
  user,
  blogsData,
}) => {
  const sortedBlogs = blogsData
    ? [...blogsData].sort((a, b) => b.likes - a.likes)
    : [];

    return (
        <div>
          <h2>Blogs</h2>
          <Box pb={2} pl={1}> {/* padding-bottom and padding-left */}
            <Togglable buttonLabel="Create">
              <BlogSubmit handlePost={handlePost} />
            </Togglable>
          </Box>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                {sortedBlogs.map((blog) => (
                  <Blog
                    key={blog.id}
                    blog={blog}
                    handleDelete={handleDelete}
                    handleLike={handleLike}
                    user={user}
                  />
                ))}
              </TableBody>
      </Table>
    </TableContainer>
  </div>
      );
};

export default BlogList;
