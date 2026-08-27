import React from 'react';

const Loading = () => {
  return (
    <div className='h-screen w-screen flex items-center justify-center '>
      <div className='relative'>
<img src="/Images/mascot1.webp" alt=""  className='h-36  absolute top-1/5 -translate-y-1/2 left-1/2 -translate-x-1/2' />


        <svg xmlns="http://www.w3.org/2000/svg" height="200" width="200">
          <g style={{ order: -1 }}>
            <polygon
              transform="rotate(45 100 100)"
              strokeWidth="1"
              stroke="#17afbd"
              fill="none"
              points="70,70 148,50 130,130 50,150"
              id="bounce"
            ></polygon>
            <polygon
              transform="rotate(45 100 100)"
              strokeWidth="1"
              stroke="#07e7fca4"
              fill="none"
              points="70,70 148,50 130,130 50,150"
              id="bounce2"
            ></polygon>
            <polygon
              transform="rotate(45 100 100)"
              strokeWidth="2"
              stroke=""
              fill="#414750"
              points="70,70 150,50 130,130 50,150"
            ></polygon>
            <polygon
              strokeWidth="2"
              stroke=""
              fill="url(#gradiente)"
              points="100,70 150,100 100,130 50,100"
            ></polygon>
            <defs>
              <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente">
                <stop stopColor="#1e2026" stopOpacity="1" offset="20%"></stop>
                <stop stopColor="#414750" stopOpacity="1" offset="60%"></stop>
              </linearGradient>
            </defs>
            <polygon
              transform="translate(20, 31)"
              strokeWidth="2"
              stroke=""
              fill="#227f8b"
              points="80,50 80,75 80,99 40,75"
            ></polygon>
            <polygon
              transform="translate(20, 31)"
              strokeWidth="2"
              stroke=""
              fill="url(#gradiente2)"
              points="40,-40 80,-40 80,99 40,75"
            ></polygon>
            <defs>
              <linearGradient y2="100%" x2="0%" y1="-17%" x1="10%" id="gradiente2">
                <stop stopColor="#1f474400" stopOpacity="1" offset="20%"></stop>
                <stop
                  stopColor="#10c6d354"
                  stopOpacity="1"
                  offset="100%"
                  id="animatedStop"
                ></stop>
              </linearGradient>
            </defs>
            <polygon
              transform="rotate(180 100 100) translate(20, 20)"
              strokeWidth="2"
              stroke=""
              fill="#17afbd"
              points="80,50 80,75 80,99 40,75"
            ></polygon>
            <polygon
              transform="rotate(0 100 100) translate(60, 20)"
              strokeWidth="2"
              stroke=""
              fill="url(#gradiente3)"
              points="40,-40 80,-40 80,85 40,110.2"
            ></polygon>
            <defs>
              <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente3">
                <stop stopColor="#10ccd300" stopOpacity="1" offset="20%"></stop>
                <stop
                  stopColor="#d3a51054"
                  stopOpacity="1"
                  offset="100%"
                  className="animatedStop"
                ></stop>
              </linearGradient>
            </defs>
            <polygon
              transform="rotate(45 100 100) translate(80, 95)"
              strokeWidth="2"
              stroke=""
              fill="#ffffff"
              points="5,0 5,5 0,5 0,0"
              className="particles"
            ></polygon>
            <polygon
              transform="rotate(45 100 100) translate(80, 55)"
              strokeWidth="2"
              stroke=""
              fill="#17afbd"
              points="6,0 6,6 0,6 0,0"
              className="particles"
            ></polygon>
            <polygon
              transform="rotate(45 100 100) translate(70, 80)"
              strokeWidth="2"
              stroke=""
              fill="#17afbd"
              points="2,0 2,2 0,2 0,0"
              className="particles"
            ></polygon>
            <polygon
              strokeWidth="2"
              stroke=""
              fill="#292d34"
              points="29.5,99.8 100,142 100,172 29.5,130"
            ></polygon>
            <polygon
              transform="translate(50, 92)"
              strokeWidth="2"
              stroke=""
              fill="#1f2127"
              points="50,50 120.5,8 120.5,35 50,80"
            ></polygon>
          </g>
        </svg>

        <style>{`
          .container {
            background-color: #17afbd;
          }
          @keyframes bounce {
            0%,
            100% {
              translate: 0px 36px;
            }
            50% {
              translate: 0px 46px;
            }
          }
          @keyframes bounce2 {
            0%,
            100% {
              translate: 0px 46px;
            }
            50% {
              translate: 0px 56px;
            }
          }
          @keyframes umbral {
            0% {
              stop-color: #10bcd32e;
            }
            50% {
              stop-color: #2fcad8;
            }
            100% {
              stop-color: #10d3982e;
            }
          }
          @keyframes partciles {
            0%,
            100% {
              translate: 0px 16px;
            }
            50% {
              translate: 0px 6px;
            }
          }
          .particles {
            animation: partciles 4s ease-in-out infinite;
          }
          #animatedStop, .animatedStop {
            animation: umbral 4s infinite;
          }
          #bounce {
            animation: bounce 4s ease-in-out infinite;
            translate: 0px 36px;
          }
          #bounce2 {
            animation: bounce2 4s ease-in-out infinite;
            translate: 0px 46px;
            animation-delay: 0.5s;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loading;