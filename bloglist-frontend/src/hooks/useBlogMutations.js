import { useMutation } from "react-query";
import blogService from "../services/blogs";

export const useBlogMutations = (refetchBlogs, notificationDispatch) => {
  // Create a blog
  const createBlogMutation = useMutation(blogService.create, {
    onSuccess: () => {
      refetchBlogs();
      notificationDispatch({ type: "CREATED" });
    },
    onError: () => {
      notificationDispatch({ type: "ERROR_CREATE" });
    },
  });

  // Like a blog
  const likeBlogMutation = useMutation(
    async (blogId) => {
      // Fetch the specific blog first
      const existingBlog = await blogService.get(blogId); // Assuming you have a get method to fetch a single blog by ID

      console.log("existingBlog", existingBlog);

      // Update the like count locally
      const updatedBlog = {
        ...existingBlog,
        likes: existingBlog.likes + 1,
      };

      console.log("updatedBlog", updatedBlog);
      // Update the blog in the backend
      return blogService.update(blogId, updatedBlog);
    },
    {
      onSuccess: () => {
        refetchBlogs();
        notificationDispatch({ type: "LIKED" });
      },
      onError: () => {
        notificationDispatch({ type: "ERROR_LIKE" });
      },
    },
  );

  // Update a blog
  const updateBlogMutation = useMutation(
    (idAndObject) => blogService.update(...idAndObject),
    {
      onSuccess: () => {
        refetchBlogs();
        notificationDispatch({ type: "UPDATED" }); // Note this change
      },
      onError: () => {
        notificationDispatch({ type: "ERROR_UPDATE" }); // Note this change
      },
    },
  );

  // Delete a blog
  const deleteBlogMutation = useMutation(blogService.deleteBlog, {
    onSuccess: () => {
      refetchBlogs();
      notificationDispatch({ type: "DELETED" });
    },
    onError: () => {
      notificationDispatch({ type: "ERROR_DELETE" });
    },
  });

  const mutations = {
    createBlogMutation,
    likeBlogMutation,
    deleteBlogMutation,
    updateBlogMutation,
  };

  return mutations;
};
