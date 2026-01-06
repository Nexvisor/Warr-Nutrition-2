// Import necessary hooks and libraries.
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/utils/DataSlice";

// Define a TypeScript type for the user object we expect from the session.
// This helps with code completion and prevents common typing errors.
type User = {
  id: string;
  email: string;
  role: string;
};

// This is a custom React hook named `useUserData`.
// Custom hooks are a way to reuse stateful logic between different components.
// The purpose of this hook is to fetch detailed user information from our API
// once the user is authenticated and update the global state (Redux).
function useUserData() {
  // `useDispatch` is a hook from React-Redux that gives us the `dispatch` function.
  // We use `dispatch` to send actions to our Redux store.
  const dispatch = useDispatch();

  // `useSession` is a hook from NextAuth.js that provides session data.
  // It tells us if the user is authenticated, loading, or unauthenticated.
  const session = useSession();

  // Destructure the session object to get the authentication status and the session data.
  // `status` can be 'authenticated', 'loading', or 'unauthenticated'.
  // `data` contains the session information, including the user object.
  const { status, data } = session;

  // Safely access the user object from the session data.
  // The `?.` (optional chaining) prevents an error if `data` is null or undefined.
  // We use `as User` to tell TypeScript that we expect `data.user` to match our `User` type.
  const user = data?.user as User;

  // Define an asynchronous function to fetch user data from our API.
  async function getUserData() {
    // The `try...catch` block is used for error handling.
    // The code inside `try` is executed, and if any error occurs,
    // the `catch` block is executed instead of crashing the app.
    try {
      // Step 1: Make a GET request to our API endpoint.
      // We use a template literal to include the user's ID in the URL as a query parameter.
      const res = await axios.get(`/api/user/get-user-info?id=${user.id}`);

      // Step 2: Destructure the response data from the API.
      // We rename the `user` property from the response to `userInfo` to avoid naming conflicts.
      const { success, user: userInfo } = res.data;

      // Step 3: If the API response indicates failure, we stop execution.
      if (!success) return;

      // Step 4: If successful, dispatch the `setUserInfo` action with the fetched data.
      // This updates our Redux store, making the user info available throughout the app.
      dispatch(setUserInfo(userInfo));
    } catch (error) {
      // Step 5: If any error occurs during the API call, log it to the console.
      // This is helpful for debugging issues with the API or network.
      console.error("Error fetching user data:", error);
    }
  }

  // `useEffect` is a React hook that runs side effects in function components.
  // This effect will run whenever the `user.id` changes.
  useEffect(() => {
    // We only want to fetch data if we have a user ID.
    // The `user` object might be undefined initially, so this check is important.
    if (!user?.id) return;

    // Call the function to fetch user data.
    getUserData();
  }, [user?.id]); // The effect depends on `user.id`. It will re-run if the ID changes.

  // The hook returns the authentication status.
  // Components using this hook can use this status to show different UI
  // (e.g., a loading spinner, a login button, or the user's account info).
  return { status, user: data?.user };
}

export default useUserData;
