import { useQuery } from "react-query";
import userService from "../services/users";

export const useUsersQuery = () => {
  return useQuery("users", userService.getAll);
};
