import { useEffect } from "react";
import blogService from "./services/blogs";
import BlogList from "./components/BlogList";
import "./index.css";
import Notification from "./components/Notification";
import { useNotificationDispatch } from "./contexts/NotificationContext";
import { useUser } from "./contexts/UserContext";
import { Login } from "./components/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
} from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'

import { AppBar, Toolbar, Typography, Box } from '@mui/material';

import { useBlogsQuery } from "./hooks/useBlogsQuery";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useBlogMutations } from "./hooks/useBlogMutations";


const App = () => {
  const { state, dispatch } = useUser();
  const notificationDispatch = useNotificationDispatch();

  const { data: blogsData, refetch: refetchBlogs } = useBlogsQuery();
  const { data: usersData } = useUsersQuery();

  const padding = {
    padding: 5,
    paddingTop: 10,
  };

  useEffect(() => {
    // Read the logged-in user's information from local storage
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      // Use dispatch from UserContext to set the user
      dispatch({ type: "LOGIN", payload: user });

      // Set the token for blogService
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const mutations = useBlogMutations(refetchBlogs, notificationDispatch);

  const {
    createBlogMutation,
    likeBlogMutation,
    updateBlogMutation,
    deleteBlogMutation,
  } = mutations;

  const handleLike = (blogId) => {
    likeBlogMutation.mutate(blogId);
  };

  const handlePost = (blogObject) => {
    createBlogMutation.mutate(blogObject);
  };

  const handleUpdate = (blogId, blogObject) => {
    updateBlogMutation.mutate([blogId, blogObject]);
  };

  const handleDelete = (blogId) => {
    deleteBlogMutation.mutate(blogId);
  };

  const LogoutButton = () => {
    const handleLogOut = () => {
      window.localStorage.removeItem("loggedBlogappUser");
      dispatch({ type: "LOGOUT" });
      notificationDispatch({ type: "LOGOUT" });
    };

    return <button onClick={handleLogOut}>Log out</button>;
  };

  const Links = () => (
    <div style={{ display: "inline" }}>
      <Link style={padding} to="/">
        Home
      </Link>
      <Link style={padding} to="/users">
        Users
      </Link>
    </div>
  );

  const sortedUsers = usersData
    ? [...usersData].sort((a, b) => b.blogs.length - a.blogs.length)
    : [];

  const Users = () => {
    return (
      <div style={{ paddingTop: 10 }}>
        <table>
          <thead>
            <tr>
              <th>Users</th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name} </Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const User = ({ user }) => {
    if (!user) return null;

    return (
      <div>
        <h2>{user.name}</h2>
        <h3>Added blogs</h3>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
  };

  const UserRoute = () => {
    const match = useMatch("/users/:id");

    if (match && usersData) {
      const user = usersData.find((user) => user.id === match.params.id);
      return <User user={user} />;
    }
    return null;
  };


  
  const CommentForm = ({ id }) => {
    if (!id) return null;



    const handleComment = (event) => {
      event.preventDefault();
      const content = event.target.comment.value;
      event.target.comment.value = "";
      blogService.createComment(id, content);
      notificationDispatch({ message: `Comment successfully added` });
    };

    return (
      <form onSubmit={handleComment}>
        <input name="comment" />
        <button type="submit">Add comment</button>
      </form>
    );
  };


  const BlogDisplay = ({ blog }) => {
    if (!blog) return null;

    let modifiedUrl = blog.url;

    // If blog.url does not contain www, add www.
    if (!modifiedUrl.includes("www.")) {
      modifiedUrl = "www." + modifiedUrl;
    }

    // If blog.url is not prefixed with http:// or https://, add http://
    if (
      !modifiedUrl.startsWith("http://") &&
      !modifiedUrl.startsWith("https://")
    ) {
      modifiedUrl = "http://" + modifiedUrl;
    }

    return (
      <div>
        <h2>{blog.title}</h2>
        <a href={modifiedUrl}>{modifiedUrl}</a>
        <br />
        likes: {blog.likes}{" "}
        <button onClick={() => handleLike(blog.id)}>like</button>
        <br />
        {blog.user && blog.user.name && `Added by: ${blog.user.name}`}
        <h3>Comments</h3>
        <CommentForm id={blog.id} />
        Add comment
        <ul>
          {blog.comments.map((comment) => {
            return <li key={comment._id}>{comment.content}</li>; // JSX returned here
          })}
        </ul>
      </div>
    );
  };

  const BlogRoute = () => {
    const match = useMatch("/blogs/:id");
    if (match && blogsData) {
      const blog = blogsData.find((blog) => blog.id === match.params.id);
      return <BlogDisplay blog={blog} />;
    }
  };

  return (
    <Container>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Blog app, JT Russell 2023</Typography>
          </Toolbar>
        </AppBar>

        <Box mt={3}> {/* margin-top for spacing */}
          <Notification />
          
          {!state.user && (
            <Login dispatch={dispatch} notificationDispatch={notificationDispatch} />
          )}

          {state.user && (
            <Box mt={2}>
              <div className="navigation">
                <span>
                  <Links /> 
                  <Typography variant="body1" display="inline">
                    {state.user.name} logged in
                  </Typography>
                </span>
                <Box ml={1} display="inline"> {/* margin-left */}
                  <LogoutButton />
                </Box>
              </div>

              <Routes>
                <Route
                  path="/"
                  element={
                    <BlogList
                      handlePost={handlePost}
                      handleUpdate={handleUpdate}
                      handleDelete={handleDelete}
                      handleLike={handleLike}
                      user={state.user}
                      blogsData={blogsData}
                    />
                  }
                />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserRoute />} />
                <Route path="/blogs/:id" element={<BlogRoute />} />
              </Routes>
            </Box>
          )}
        </Box>
      </Router>
    </Container>
  );
};

export default App;
