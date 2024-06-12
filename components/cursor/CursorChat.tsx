import CursorSVG from '@/public/assets/CursorSVG'
import { CursorChatProps, CursorMode } from '@/types/type'
import React from 'react'

// {cursorState.mode === CursorMode.Chat && ()}
const CursorChat = ({ cursor, cursorState, setCursorState, updateMyPresence }: CursorChatProps) => {
 

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
updateMyPresence({message:e.target.value}) 
setCursorState({
  mode:CursorMode.Chat,
  previousMessage:null,
  message: e.target.value,
})
  
}
  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key === 'Enter'){
setCursorState({
  mode:CursorMode.Chat,
  previousMessage:cursorState.message,
  message:''
})
    }else if(e.key === 'Escape'){
      setCursorState({mode:CursorMode.Hidden})
    }
  
  }




  return (
    <div className="absolute top-0 left-0" style={{ transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)` }}>
    
    <CursorSVG color="#000" />
    {cursorState.mode==CursorMode.Chat &&(
      <>        
        
        <div onKeyUp={(e)=>{ e.stopPropagation()}} className="absolute left-2 top-5 bg-blue-500 px-4 py-4 text-sm leading-relaxed text-white rounded-[20px]">
        {cursorState.previousMessage &&(
          <div>{cursorState.previousMessage}</div>
        )}

        <input onChange={handleChange} onKeyDown={handleKeyDown} placeholder={cursorState.previousMessage?'':'Type a message...'} value={cursorState.message} maxLength={50} className="z-10 w-60 border-none bg-transparent text-white placeholder-blue-300 outline-none"  autoFocus={true}></input>
        </div>
        </>
    )}
    </div>
  )
}

export default CursorChat