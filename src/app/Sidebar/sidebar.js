"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  AlignJustify,
  DeleteIcon,
  Trash,
  LockIcon,
  Plus,
  PlusIcon,
  MessageSquareIcon,
} from "lucide-react";
import { Fragment, useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { useChatContext } from "../../contexts/ChatContext";
import { useAuth, useClerk } from "@clerk/nextjs";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Sidebar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const { authUser } = useFirebaseAuthContext();44
  const router = useRouter();
  const { signOut } = useClerk()
  const { push } = useRouter();

  const { chatLog, setChatLog, setShowMenu, user } = useChatContext();
  const { userId } = useAuth()


  useEffect(() => {
    getChatList()
  }, []);
  function getChatList() {
    fetch(`/api/chatHistory?userId=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
      })
      .then(data => {
        setChatLog([...data.data])

        // Handle the fetched data here (e.g., update UI)
      })
      .catch(error => {
        console.error('Error fetching chats:', error); // Log any errors
        // Handle errors here (e.g., display error message)
      });
  }


  return (
    <>
      <div>


        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4 ">
                <div className="w-full bg-[#2563EB] px-3 py-2 flex items-center rounded-lg flex-wrap text-white text-sm">
                  <div className="p-4 w-6 h-6 flex justify-center items-center bg-white text-[#2563EB] rounded-full mr-3">
                    {/* {authUser?.name[0]?.split("")[0]}
                  </div>{" "}
                  </
                  {authUser?.name} */}
                    {user? user?.name?.split("")[0] :""}
                  </div>
                 {user?.name}
                </div>
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-3">
              <a
                  href={"#"}
                  className={classNames(
                    "bg-white text-[#2563EB] group flex items-center rounded-md px-3 py-3 text-sm font-medium"
                  )}
                  onClick={() => {
                    router.push('/')
                    setShowMenu(false);
                  }}
                >
                  <Plus
                    className={classNames(
                      "text-[#2563EB] mr-3 h-6 w-6 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  Start a chat
                </a>
                {chatLog.map(
                  (chat, idx) =>
                    chat.result && (
                      <a
                        key={idx}
                        onClick={() => router.push(`/chat/${chat.chatHistoryId}`)}
                        className={classNames(
                          "bg-gray-900 text-white text-gray-300 hover:bg-gray-700 hover:text-white",
                          "group flex items-center rounded-md px-3 py-3 text-sm font-medium cursor-pointer"
                        )}
                      >
                        <MessageSquareIcon
                          className={classNames(
                            "text-gray-300 mr-3 h-6 w-6 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {`${chat.prompt.slice(0, 20)}.....`}
                      </a>
                    )
                )}

              </nav>
            </div>
            <div className="px-2">
              <div className="flex flex-col flex-shrink-0 border-t-2 border-t-gray-700 p-4">
                <a
                  onClick={() => {
                    setChatLog([]);
                    setShowMenu(false);
                  }}
                  className="group block w-full flex-shrink-0 py-1 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div>
                      <Trash className="text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">
                        Clear all conversations
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="group block w-full flex-shrink-0 mt-4 py-1"
                  onClick={() => signOut(() => router.push('/signin'))}
                >
                  <div className="flex items-center">
                    <div>
                      <LockIcon className="text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">Logout</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col lg:pl-64">
          <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <AlignJustify className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1 bg-repeat bg-gray-700">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
