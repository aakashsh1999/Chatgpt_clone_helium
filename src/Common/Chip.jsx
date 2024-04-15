import React from 'react'

function Chip({ text }) {
  return (
    <span className="relative rounded-full py-1 px-3 text-sm leading-6 ring-1 ring-[#155EEF]/10 hover:ring-[#155EEF]/20 bg-white text-[#155EEF] w-auto ">
      {text}
    </span>
  )
}

export default Chip
