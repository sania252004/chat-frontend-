import React from 'react';
import { ChatData } from '../context/ChatContext';

const Header = () => {
  const { chats } = ChatData();
  return (
    <div> 
        <p className="text-lg mb-6 ml-4"> Hello, how can I assist you today? </p>
        {chats && chats.length === 0 && (
          <p className="text-lg mb-6 ml-4">Create new chat to continue</p>
        )} 
      </div>
    );
  }; 

export default Header; 
