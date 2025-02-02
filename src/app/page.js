"use client";
import React, { useState, useEffect, useRef } from "react";
import UserPrompt from "../components/Chat/UserPrompt";
import SystemPrompt from "../components/Chat/SystemPrompt";
import { RefreshCcwIcon, RefreshCwIcon, ArrowUpIcon } from "lucide-react";
import { useChatContext } from "../contexts/ChatContext";
import { Sidebar } from "./Sidebar/sidebar";
import { useAuth } from "@clerk/nextjs";
import Loading from "../Common/Loader/Loader";
import { useRouter } from "next/navigation";


function Home() {
  const [chatHistoryId, setChatHistoryId] = useState(null);

  useEffect(() => {
    // Fetch chatHistoryId from localStorage when the component mounts
    const storedChatHistoryId = localStorage.getItem('chatHistoryId');
    if (storedChatHistoryId) {
      setChatHistoryId(storedChatHistoryId);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const { chatLog, setChatLog, isButtonVisible, isPrinting, setIsPrinting, user } =
    useChatContext();
  const data = useAuth()
  const [inputPrompt, setInputPrompt] = useState("");
  const [err, setErr] = useState(false);
  const [responseFromAPI, setReponseFromAPI] = useState(false);
  const [chatList, setChatList] = useState([])

  const chatLogRef = useRef(null);
  const stopPrinting = () => setIsPrinting(!isPrinting);

  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() =>{
    if(!user){
      router.push('/signin')
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!responseFromAPI) {
      if (inputPrompt.trim() !== "") {
        // Set responseFromAPI to true before making the fetch request
        setReponseFromAPI(true);
        setChatList([...chatList, { prompt: inputPrompt }]);
        callAPI();
    }
  
      async function callAPI() {
        
        try {
          const response = await (await fetch(
            "/api/chatbot", {
            method: "POST",
            body: JSON.stringify({
              inputPrompt,
              chatHistoryId:chatHistoryId
            })
          }
          )).json()

          if (response) {
            setChatList([
              ...chatList,
              {
                prompt: inputPrompt,
                result: response?.botResponse,
              },
            ]);
            localStorage.setItem("chatHistoryId", response.chatHistoryId)
            setInputPrompt("");
            setErr(false);
          }
        } catch (err) {
          setErr(err);
          console.log(err);
        }
        //  Set responseFromAPI back to false after the fetch request is complete
        setReponseFromAPI(false);
      }
    }

    setInputPrompt("");
  };

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    return () => { };
  }, []);

  return (
    <Sidebar>
      <div
        className="relative"
        style={{
          height: "95vh",

        }}
      >
        {chatList.length <=0 && <div className="flex justify-between flex-col lg:max-w-2xl mx-auto ">
              <div className="mx-auto py-24 sm:pt-96">
                <div className="text-center">
                  <span className="text-2xl font-bold tracking-tight text-white ">
                   How Can I help you?
                  </span>
                </div>
                </div>
              </div>}
        <form onSubmit={handleSubmit}>
          <div className="relative pt-1p  mx-auto max-w-3xl">
          {loading &&<div className="w-full h-screen flex justify-center
            items-center"> <Loading/> </div>}
            {chatList.length > 0 && (
              <div className="chatLogWrapper scrollbar-hide">
                {chatList.length > 0 &&
                  chatList.map((chat, idx) => (
                    <div
                      className="chatLog"
                      key={idx}
                      ref={chatLogRef}
                      id={`navPrompt-${chat?.prompt.replace(
                        /[^a-zA-Z0-9]/g,
                        "-"
                      )}`}
                    >
                      <UserPrompt chatPrompt={chat.prompt} />
                      <SystemPrompt
                        botMessage={chat.result}
                        chatLogRef={chatLogRef}
                       
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
          {chatList.length >= 0 && (
            <div className="max-w-3xl absolute w-full left-[50%] -translate-x-[50%] bottom-0">
              <div className="relative mt-2 rounded-md shadow-sm">
                {/* <Hint options={HintArray} allowTabFill> */}
                <input
                  type="text"
                  name="chat_text"
                  className="block w-full rounded-md border-0 py-3 pl-2 pr-12 text-white bg-transparent shadow-xl ring-1 ring-inset ring-white placeholder:text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 z-0"
                   placeholder="Message ChatGPT...."
                  onChange={(e) => setInputPrompt(e.target.value)}
                />
                {/* </Hint> */}
                <button
                  className=" absolute inset-y-0 top-1 right-1 px-2 rounded-xl flex items-center text-black bg-gray-400 
                  h-10 w-10 z-100"
                  type="submit"
               
                  onClick={handleSubmit}
                >
                  <ArrowUpIcon className="w-6 h-4"/>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </Sidebar>
  );
}

export default Home;
