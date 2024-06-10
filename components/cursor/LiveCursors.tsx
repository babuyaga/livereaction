import { LiveCursorProps } from '@/types/type'
import React from 'react'
import Cursor from './Cursor';
import { COLORS } from '@/constants';

const LiveCursors = ({others}:LiveCursorProps) => {
  return others.map(({connectionId,presence})=>{
console.log("livecursors", connectionId,presence)
if(!presence) return null;

return <Cursor key={connectionId} color={COLORS[Number(connectionId)%COLORS.length]} x={presence.x} y={presence.y} message={presence.message}/>
  })
  
}

export default LiveCursors