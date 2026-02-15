import React from 'react';

export const InfoSection = ({ header, text, image, bgprimary }: any) => {
  return (
    <div className={`sm:flex justify-between px-[20px] sm:px-[96px] py-[40px] sm:py-[60px] ${bgprimary ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
        <div>
            <h2>{header}</h2>
            <p>{text}</p>
        </div>
        <div>
            {image}
        </div>
    </div>
  )
}
