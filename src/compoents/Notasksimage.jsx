import React from 'react'

const Notasksimage = () => {
  return (
    <div>
      
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
   {/* // <!-- Sophisticated background gradient --> */}
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#E1F5FE"/>
      <stop offset="100%" style="stop-color:#B3E5FC"/>
    </linearGradient>
    
    {/* <!-- Confetti particle --> */}
    <path id="confetti" d="M-2,-2 L2,-2 L2,2 L-2,2 Z"/>
    
    {/* <!-- Cloud shape --> */}
    <path id="cloud" d="M-25,0 a20,20 0 0 1 0,-40 h50 a20,20 0 0 1 0,40 z"/>
  </defs>

  {/* <!-- Sky background --> */}
  <rect width="400" height="300" fill="url(#skyGradient)"/>
  
  {/* <!-- Floating clouds --> */}
  <g fill="white" opacity="0.8">
    <use href="#cloud" transform="translate(80,60) scale(0.6)">
      <animate attributeName="transform" 
        values="translate(80,60) scale(0.6);translate(85,60) scale(0.6);translate(80,60) scale(0.6)" 
        dur="4s" repeatCount="indefinite"/>
    </use>
    <use href="#cloud" transform="translate(320,90) scale(0.8)">
      <animate attributeName="transform" 
        values="translate(320,90) scale(0.8);translate(315,90) scale(0.8);translate(320,90) scale(0.8)" 
        dur="5s" repeatCount="indefinite"/>
    </use>
  </g>

  {/* <!-- Main celebration scene --> */}
  <g transform="translate(200,140)">
    {/* <!-- Celebration platform --> */}
    <ellipse cx="0" cy="40" rx="120" ry="20" fill="#E3F2FD" opacity="0.6"/>
    
    {/* <!-- Happy character --> */}
    <g transform="translate(0,-20)">
      {/* <!-- Body --> */}

      <path d="M0,0 c-20,0 -25,20 -25,40 c0,20 50,20 50,0 c0,-20 -5,-40 -25,-40" 
        fill="#2196F3">
        <animate attributeName="d" 
          values="M0,0 c-20,0 -25,20 -25,40 c0,20 50,20 50,0 c0,-20 -5,-40 -25,-40;
                 M0,0 c-20,0 -25,15 -25,35 c0,20 50,20 50,0 c0,-20 -5,-35 -25,-35;
                 M0,0 c-20,0 -25,20 -25,40 c0,20 50,20 50,0 c0,-20 -5,-40 -25,-40"
          dur="1s" repeatCount="indefinite"/>
      </path>
      
      {/* <!-- Face --> */}
      <g transform="translate(0,15)">
        {/* <!-- Eyes --> */}
        <g transform="translate(-10,0)">
          <path d="M-3,-3 Q0,-8 3,-3 Q0,2 -3,-3" fill="white">
            <animate attributeName="d" 
              values="M-3,-3 Q0,-8 3,-3 Q0,2 -3,-3;M-3,-3 Q0,-6 3,-3 Q0,0 -3,-3;M-3,-3 Q0,-8 3,-3 Q0,2 -3,-3"
              dur="2s" repeatCount="indefinite"/>
          </path>
        </g>
        <g transform="translate(10,0)">
          <path d="M-3,-3 Q0,-8 3,-3 Q0,2 -3,-3" fill="white">
            <animate attributeName="d" 
              values="M-3,-3 Q0,-8 3,-3 Q0,2 -3,-3;M-3,-3 Q0,-6 3,-3 Q0,0 -3,-3;M-3,-3 Q0,-8 3,-3 Q0,2 -3,-3"
              dur="2s" repeatCount="indefinite"/>
          </path>
        </g>
        
        {/* <!-- Smile --> */}
        <path d="M-15,10 Q0,25 15,10" stroke="white" stroke-width="3" fill="none">
          <animate attributeName="d" 
            values="M-15,10 Q0,25 15,10;M-15,8 Q0,23 15,8;M-15,10 Q0,25 15,10"
            dur="2s" repeatCount="indefinite"/>
        </path>
      </g>
    </g>

    {/* <!-- Floating tickets being cleared --> */}
    <g>
      <g transform="translate(-40,-40)">
        <rect width="30" height="20" rx="4" fill="white" opacity="0.9" transform="rotate(-15)">
          <animate attributeName="opacity" values="0.9;0;0.9" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="transform" values="rotate(-15) translate(0,0);rotate(-15) translate(-20,-20)" dur="3s" repeatCount="indefinite"/>
        </rect>
      </g>
      <g transform="translate(40,-30)">
        <rect width="30" height="20" rx="4" fill="white" opacity="0.9" transform="rotate(15)">
          <animate attributeName="opacity" values="0.9;0;0.9" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="transform" values="rotate(15) translate(0,0);rotate(15) translate(20,-20)" dur="2.5s" repeatCount="indefinite"/>
        </rect>
      </g>
    </g>
{/* 
    <!-- Celebration sparkles --> */}
    <g>
      <circle cx="-50" cy="-20" r="2" fill="#FFC107">
        <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="-30" r="2" fill="#FFC107">
        <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="-60" r="2" fill="#FFC107">
        <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
      </circle>
    </g>
  </g>

  {/* <!-- Message --> */}
  <g transform="translate(200,240)">
    <text text-anchor="middle" font-family="Arial, sans-serif">
      <tspan x="0" font-size="24" fill="#1565C0" font-weight="bold">
        Hooray!
        <animate attributeName="y" values="0;-5;0" dur="2s" repeatCount="indefinite"/>
      </tspan>
      <tspan x="0" dy="25" font-size="14" fill="#424242">All tickets cleared - Time to celebrate!</tspan>
    </text>
  </g>
</svg>
    </div>
  )
}

export default Notasksimage
