import { useQuery } from "react-query";
import blogService from "../services/blogs";

export const useBlogsQuery = () => {
  return useQuery("blogs", blogService.getAll);
};
