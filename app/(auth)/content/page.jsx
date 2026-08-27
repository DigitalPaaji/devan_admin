"use client";
import React, { useRef, useState } from 'react'

const page = () => {
  return (
    <div>

<DraggableBox />

    </div>
  )
}

export default page


const DraggableBox=()=>{
  const [position, setPosition] = useState({ x: 100, y: 100 });
const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    dragging.current = true;
    // Remember where inside the box the user clicked
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };


  const handleMouseMove = (e) => {
    if (!dragging.current) return;

    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };
    return (

        <div
         onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="fixed inset-0"
        >

 <div
        onMouseDown={handleMouseDown}
        style={{
          left: position.x,
          top: position.y,
        }}
        className="absolute w-40 h-40 bg-blue-500 rounded-xl cursor-grab active:cursor-grabbing"
      >
        Drag me
      </div>
        </div>
    )
}