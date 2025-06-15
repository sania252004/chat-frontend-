import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { GiHamburgerMenu } from "react-icons/gi";
import Header from '../components/Header';
import { ChatData } from '../context/ChatContext';
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingBig, LoadingSmall } from '../components/Loading';
import { IoMdSend } from "react-icons/io";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fetchResponse, messages, prompt, setPrompt, newRequestLoading, loading, chats,  } = ChatData();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const messagecontainerRef = useRef();

  useEffect(() => {
    if (messagecontainerRef.current) {
      messagecontainerRef.current.scrollTo({
        top: messagecontainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const submitHandler = (e) => {
    e.preventDefault();
    fetchResponse();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 bg-gray-800 text-2xl"
        >
          <GiHamburgerMenu />
        </button>

        <div className="flex-1 flex flex-col overflow-hidden"> 
          <Header />
          {loading ? (
             <LoadingBig/> 
          ): ( 
            <div
            className="flex-1 overflow-y-auto px-6 py-2 pb-28 thin-scrollbar space-y-4"
            ref={messagecontainerRef}>
            {messages && messages.length > 0 ? (
              messages.map((e, i) => (
                <div key={i}>
                  <div className="mb-4 p-4 rounded bg-blue-700 text-white flex gap-2">
                    <div className="bg-white p-2 rounded-full text-black text-2xl h-10 w-10 flex items-center justify-center">
                      <CgProfile />
                    </div>
                    <span>{e.question}</span>
                  </div>

                  <div className="mb-4 p-4 rounded bg-gray-700 text-white flex gap-2">
                    <div className="bg-white p-2 rounded-full text-black text-2xl h-10 w-10 flex items-center justify-center">
                      <FaRobot />
                    </div>
                    <p
                      className="whitespace-pre-wrap break-words overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: e.answer }}
                    ></p>
                  </div>
                </div>
              ))
            ) : (
              <p>No chat yet</p>
            )}

            {newRequestLoading && <LoadingSmall />}
          </div>
          )} 
        </div> 
      </div>

      { chats  && chats.length === 0 ? (
           "" 
        ) : (  
        
        <div className="fixed bottom-0 right-0 left-auto p-4 bg-gray-900 w-full md:w-[75%]">
        <form
          onSubmit={submitHandler}
          className="flex justify-center items-center"
        >
          <input
            className="flex-grow p-4 bg-gray-700 rounded-l text-white outline-none"
            type="text"
            placeholder="Enter a prompt here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
          <button className="p-4 bg-gray-700 rounded-r text-2xl text-white">
            <IoMdSend />
          </button>
        </form>
      </div>
    )}   
     </div> 
  );
};

export default Home;
