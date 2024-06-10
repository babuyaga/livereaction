'use client'
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@/liveblocks.config'
import CursorChat from './cursor/CursorChat'
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type'
import ReactionSelector from './reaction/ReactionButton'
import FlyingReaction from './reaction/FlyingReaction'
import useInterval from '@/hooks/useInterval'

const Live = () => {

  const others = useOthers();
  const [cursor, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  })
  const setReactions = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false })

  }, [])


  const [reaction, setReaction] = useState<Reaction[]>([])

const broadcast = useBroadcastEvent();


  useInterval(() => {

    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      setReaction((reactions) => reactions.concat([
        {
          point: { x: cursor.x, y: cursor.y },
          value: cursorState.reaction,
          timestamp: Date.now(),
        }
      ]))



      broadcast({
        x:cursor.x,
        y:cursor.y,
        value:cursorState.reaction,
      })
      
    

    }


  }, 150)

useEventListener((eventData)=>{
  const event = eventData.event as ReactionEvent;


  setReaction((reactions) => reactions.concat([
    {
      point: { x: event.x, y: event.y },
      value: event.value,
      timestamp: Date.now(),
    }
  ]))
})



  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({ cursor: true, x, y });
    }


  }, [])


  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    setCursorState({ mode: CursorMode.Hidden })
    updateMyPresence({ cursor: null, message: null });

  }, [])

  const handlePointerUp = useCallback((event: React.PointerEvent) => {

    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state);

  }, [cursorState.mode, setCursorState])
  const handlePointerDown = useCallback((event: React.PointerEvent) => {

    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({ cursor: true, x, y });

    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state);
  }, [cursorState.mode, setCursorState])

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '',
        });
      } else if (e.key === 'Escape') {
        updateMyPresence({ message: '' });
        setCursorState({
          mode: CursorMode.Hidden,
        });
      } else if (e.key === 'e') {
        setCursorState({
          mode: CursorMode.ReactionSelector,
        })
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
      }
    };

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [updateMyPresence]);

  return (
    <div onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onPointerDown={handlePointerDown} className="border-2 border-green-500 h-[100vh] w-full flex justify-center items-center">
      {cursor.cursor && (<CursorChat cursor={cursor} cursorState={cursorState} setCursorState={setCursorState} updateMyPresence={updateMyPresence} />)}

      {cursorState.mode === CursorMode.ReactionSelector && (<ReactionSelector setReaction={setReactions} />)}


      <LiveCursors others={others} />
      <div className="flex flex-col gap-12">
      <h1 className="text-2xl text-white justify-center"> Implementing Live Cursor and Reaction Functionality</h1>
      <ul className="text-white">
        <li>Open the same link in another tab on your laptop.</li>
        <li>Press 'E' and then select reaction to send it between tabs. Press 'ESC' to stop</li>
        <li>Press '/' to chat</li>
      </ul>
      </div>
      {reaction.map((r) => (
        <FlyingReaction key={r.timestamp.toString()} x={r.point.x} y={r.point.y} timestamp={r.timestamp} value={r.value} />
      ))}


    </div>
  )
}

export default Live