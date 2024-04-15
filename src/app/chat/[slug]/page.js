/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState, useEffect, useRef } from "react";
import UserPrompt from "../../../components/Chat/UserPrompt";
import SystemPrompt from "../../../components/Chat/SystemPrompt";
import { RefreshCcwIcon, RefreshCwIcon, ArrowUpIcon } from "lucide-react";
import { useChatContext } from "../../../contexts/ChatContext";
import { Sidebar } from "../../Sidebar/sidebar";
import { useAuth } from "@clerk/nextjs";
import Loading from "../../../Common/Loader/Loader";


function page({params}) {

  const { chatLog, setChatLog, isButtonVisible, isPrinting, setIsPrinting } =
    useChatContext();
  const data = useAuth()
  const [inputPrompt, setInputPrompt] = useState("");
  const [err, setErr] = useState(false);
  const [responseFromAPI, setReponseFromAPI] = useState(false);
  const [loading, setLoading] = useState(false)
  const [chatList, setChatList] = useState([])
 
  useEffect(() => {
    getChatList()
  }, []);
  function getChatList() {
    setLoading(true)
    fetch(`/api/chatlistbyhistory?chatHistoryId=${params.slug}`)
      .then(response => {
        if (!response.ok) {
          setLoading(false)
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
      })
      .then(data => {
        setLoading(false)
        setChatList([...data.data])

        // Handle the fetched data here (e.g., update UI)
      })
      .catch(error => {
        setLoading(false)
        console.error('Error fetching chats:', error); // Log any errors
        // Handle errors here (e.g., display error message)
      })
    };
  const chatLogRef = useRef(null);
  const stopPrinting = () => setIsPrinting(!isPrinting);


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
              chatHistoryId:params.slug
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

export default page;
