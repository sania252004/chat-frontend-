import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { server } from "../main";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Login function
  async function loginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });
      toast.success(data.message);
      localStorage.setItem("verifyToken", data.verifyToken);
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // Verify OTP
  async function verifyUser(otp, navigate, fetchChats) {
    const verifyToken = localStorage.getItem("verifyToken");
    if (!verifyToken) return toast.error("Please provide token");

    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        verifyToken,
      });
      toast.success(data.message);
      localStorage.clear();
      localStorage.setItem("token", data.token);
      navigate("/");
      setIsAuth(true);
      setUser(data.user);
      fetchChats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // Fetch current user
  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { token },
      });
      setIsAuth(true);
      setUser(data);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  // Logout
  const logoutHandler = (navigate) => {
    localStorage.clear();
    toast.success("You have logged out successfully"); 
    setIsAuth(false);
    setUser([]);
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        btnLoading,
        isAuth,
        setIsAuth,
        user,
        verifyUser,
        loading,
        logoutHandler,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
