
import { useUser } from "../contexts/UserContext";
import { Link } from "react-router-dom";

import {
  TableCell,
  TableRow,
  Button
} from '@mui/material'



const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const { state } = useUser();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = (blog) => {
    handleLike(blog.id);
  };

  const deleteBlog = (blog) => {
    handleDelete(blog.id);
  };

  return (
    <TableRow style={blogStyle} className="blog">
      <TableCell>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </TableCell>
      <TableCell>{blog.author}</TableCell>
      <TableCell>{blog.url}</TableCell>
      <TableCell>
        {blog.likes} likes 
        <Button size="small" variant="outlined" color="primary" onClick={() => addLike(blog)}>like</Button>
      </TableCell>
      <TableCell>
        {state.user && blog.user && state.user.username === blog.user.username && (
          <Button size="small" variant="contained" color="secondary" onClick={() => deleteBlog(blog)}>Delete</Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default Blog;
