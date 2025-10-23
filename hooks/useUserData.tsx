import { useSession } from "next-auth/react";
import React from "react";
type User = {
  id: string;
  email: string;
  role: string;
};

function useUserData() {
  const session = useSession();
  const { status, data } = session;
  const user = data?.user as User;
  console.log(user);
  return <div>useUserData</div>;
}

export default useUserData;
