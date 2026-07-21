import React from 'react'

export const LoginPhoneCell = ({data}) => {
  return (
    <div className='text-black flex items-center justify-center '>{data?.value}</div>
  )
}

export const SpendingTimeCell = ({data})=> {
    return (
         <span className="flex items-center justify-center  text-xs font-semibold text-emerald-800   font-mono">
              {data?.value}
            </span>
    )
}

export const MonitorCell = ({data})=> {
    return (
         <div className="flex gap-2 text-xs font-semibold">
            <span className="text-blue-600 hover:underline cursor-pointer">
              Listen
            </span>
            <span className="text-blue-600 hover:underline cursor-pointer">
              Whisper
            </span>
            <span className="text-blue-600 hover:underline cursor-pointer">
              Barge
            </span>
            <span className="text-red-600 hover:underline cursor-pointer">
              Logout
            </span>
          </div>
    )
}
