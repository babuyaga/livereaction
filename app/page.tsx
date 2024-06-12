'use client'

import Image from "next/image";
import { Room } from "./Room";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

import { useEffect, useRef } from "react";
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";
import {fabric} from "fabric"; 

export default function Page() {

const canvasRef = useRef<HTML5CanvasElement>(null);
const fabricRef = useRef<fabric.Canvas | null>(null);
const isDrawing = useRef(false);
const shapeRef = useRef<fabric.Object | null>(null);
const selectedShapeRef = useRef<String | null>('rectangle');




useEffect(()=>{

const canvas = initializeFabric({canvasRef,fabricRef})


canvas.on("mouse:down", (options)=>{
  handleCanvasMouseDown({
    options,canvas,isDrawing,shapeRef,selectedShapeRef
  })
})

window.addEventListener("resize",()=>{
  handleResize({fabricRef})
})
},[])


  return (
  <main className="h-screen overflow-hidden">
   <Navbar/>
   <section className="flex h-full flex-row">
    <LeftSidebar/>



    <Live canvasRef={canvasRef}/>
    
    
    <RightSidebar/>
    </section>
</main>
  );
}
