import React, { createContext, useReducer, useContext } from "react";

// Define the blog context
const BlogStateContext = createContext();

// Define the reducer function
const blogReducer = (state, action) => {
  switch (action.type) {
    case "ADD_BLOG":
      return { ...state, blogs: [...state.blogs, action.payload] };
    case "UPDATE_BLOG":
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === action.payload.id ? action.payload : blog,
        ),
      };
    case "DELETE_BLOG":
      return {
        ...state,
        blogs: state.blogs.filter((blog) => blog.id !== action.payload),
      };
    case "LIKE_BLOG":
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === action.payload
            ? { ...blog, likes: blog.likes + 1 }
            : blog,
        ),
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

// Create a provider component
export const BlogContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, { blogs: [] });

  return (
    <BlogStateContext.Provider value={{ state, dispatch }}>
      {children}
    </BlogStateContext.Provider>
  );
};

// Create a hook for easy use of the context
export const useBlogs = () => {
  const context = useContext(BlogStateContext);
  if (!context) {
    throw new Error("useBlogs must be used within a BlogContextProvider");
  }
  return context;
};
