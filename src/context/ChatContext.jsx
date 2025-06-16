import { useContext, useEffect, useState, useCallback, createContext } from "react";
import axios from "axios";
import { server } from "../main";
import { toast } from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [createLoad, setCreateLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchResponse() {
    if (prompt === "") return alert("Write prompt");
    setNewRequestLoading(true);
    const currentPrompt = prompt; 
    setPrompt("");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCrOUr9dw-C9LrRnh24pea29vxnplh9bKM",
        method: "POST",
        data: {
          contents: [{ parts: [{ text: currentPrompt }] }],
        },
      });

      const answer = response.data.candidates[0].content.parts[0].text;

      const message = {
        question: currentPrompt,
        answer: answer,
      };

      setMessages((prev) => [...prev, message]);
      setNewRequestLoading(false);

      await axios.post(
        `${server}/api/chat/${selected}`,
        {
          question: currentPrompt,
          answer: answer,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
      setNewRequestLoading(false);
    }
  }

  async function fetchChats() {
    try {
      const { data } = await axios.get(`${server}/api/chat/all`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setChats(data);
      if (data.length > 0) setSelected(data[0]._id);
    } catch {
      console.log("An error occurred while fetching messages.");
    }
  }

  async function createChat() {
    setCreateLoad(true);
    try {
      await axios.post(
        `${server}/api/chat/new`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      fetchChats();
      setCreateLoad(false);
    } catch (error) {
      toast.error("Something went wrong");
      setCreateLoad(false);
    }
  }

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/chat/${selected}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [selected]);

  async function deleteChat(id) {
    try {
      const { data } = await axios.delete(`${server}/api/chat/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      fetchChats();
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selected) fetchMessages();
  }, [selected, fetchMessages]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        messages,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createLoad,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
