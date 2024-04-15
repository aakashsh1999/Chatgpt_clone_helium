"use client";
import { useChatContext } from "../../contexts/ChatContext";
import React, { useState, useEffect } from "react";
import Loading from "../../Common/Loader/Loader";
import { data, portfolio } from "../../constants";
import Link from "next/link";

function SystemPrompt({ botMessage, chatLogRef, type }) {
  const [botResponse, setBotResponse] = useState("");
  const { isPrinting, setIsPrinting, isButtonVisible, setIsButtonVisible } =
    useChatContext();
  useEffect(() => {
    let index = 1;
    if (!botMessage) return;
    let msg = setInterval(() => {
      if (botMessage !== " - The Ultimate AI Assistant") {
        setIsButtonVisible(true);
      }
      if (!isPrinting) {
        // if isPrinting is false, clear interval and return
        clearInterval(msg);
        return;
      }
      setBotResponse(botMessage?.slice(0, index));
      if (index >= botMessage.length) {
        clearInterval(msg);
        setIsButtonVisible(false);
      }
      index++;

      // scroll to the bottom of the page whenever the messages array is updated
      if (chatLogRef !== undefined) {
        chatLogRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 50);
    return () => clearInterval(msg); // clear interval on component unmount
  }, [chatLogRef, botMessage, isPrinting]);




  return (
    <div className="flex items-start w-full mb-4 ">
      <img src="/icons/ai_avatar.svg" className="w-[48px] h-[48px] mr-3.5" />
      <div
        className="w-full border-2 border-white
        shadow-xl
        text-white
        mx-auto
    bg-transparent px-2 py-4 rounded-lg flex-wraptext-sm 
      pr-6"
      >

        {botMessage ? (
          <>
            {botResponse}
            {botResponse === botMessage ? "" : "|"}
          </>
        ) : botResponse == undefined ? (
          ""
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

export default SystemPrompt;
