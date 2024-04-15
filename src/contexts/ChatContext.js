'use client'

import { useAuth } from '@clerk/nextjs';
import React, { createContext, useContext,useEffect, useState } from 'react'

export const ChatContext = createContext()

export const ChatContextProvider = ({ children }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isPrinting, setIsPrinting] = useState(true);
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const [chatLog, setChatLog] = useState([])
    const [user, setUser] = useState({})

    const {userId} = useAuth()
    useEffect(() => {
      getUserList()
    }, []);
  
    function getUserList() {
      fetch(`/api/userdetails?userId=${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON response
        })
        .then(data => {
          setUser(data.user)
  
          // Handle the fetched data here (e.g., update UI)
        })
        .catch(error => {
          console.error('Error fetching chats:', error); // Log any errors
          // Handle errors here (e.g., display error message)
        });
    }

  
  
  return (
    <ChatContext.Provider value={{
        showMenu, setShowMenu, chatLog, setChatLog, isPrinting, setIsButtonVisible, setIsPrinting, 
        isButtonVisible,user
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  return useContext(ChatContext)
}
