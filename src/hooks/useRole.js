import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import axiosInstance from "../services/axiosInstance";

const useRole = () => {
  const { user, loading } = useAuth();

  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ["userProfile", user?.uid],
    enabled: !loading && !!user?.uid,
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/users/${user.uid}`);
      return data;
    },
    select: (data) => data?.role,
  });

  return [role, roleLoading];
};

export default useRole;
