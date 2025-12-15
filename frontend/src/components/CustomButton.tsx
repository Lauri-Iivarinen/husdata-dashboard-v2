import React from "react";
import { useState } from "react";
import { CustomButtonProps } from "./types/CustomButtonProps";

export const CustomButton = ({onClick, text, width, height}: CustomButtonProps) => {

    const [hovering, setHovering] = useState<boolean>(false)

    //onMouseEnter={() => setBgColor()}
    //onMouseLeave={() => setBgColor()}

    return (
        <button
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
                width: width !== undefined ? width : 'auto',
                backgroundColor: hovering ? 'rgb(200,200,255)' : 'rgb(210,210,210)',
                borderStyle: 'solid',
                borderColor: 'rgb(100,150,200)',
                borderWidth: '2px',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: hovering ? '0rem' : '0.35rem',
                height: height ? height : 'auto'
            }}
            onClick={onClick}
        >
            {text}
        </button>
    )
}