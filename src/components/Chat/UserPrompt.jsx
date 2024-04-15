// import { useFirebaseAuthContext } from '@/contexts/firebaseAuthContext'
import { useAuth } from '@clerk/nextjs';
import React, { useContext, useEffect, useState } from 'react'
import { useChatContext } from '../../contexts/ChatContext';


function UserPrompt({chatPrompt}) {
 const {user} = useChatContext()


  return (
    <div className="flex items-start w-full mb-4">
      <div className="flex justify-center items-center bg-white text-[#2563EB] rounded-full mr-3 border-2 border-[#D6DFEA] w-[54px] h-[50px]">
     {user?.name?.split("")[0]}
     
      </div>{' '}
      <div className="w-full border-2 border-white text-white px-2 py-4 rounded-lg flex-wrap bg-transparent  text-sm">
        {chatPrompt}
      </div>
    </div>
  )
}

export default UserPrompt
