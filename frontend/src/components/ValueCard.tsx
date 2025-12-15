import React from "react";
import { useState } from "react";
import { formatCodeValue } from "../util/formatType";
import { PumpCode } from "../util/types/PumpCode";
import { ValueCardProps } from "./types/ValueCardProps";

// TODO, print out card like information for each code

export const ValueCard = ({ pumpCode }: ValueCardProps) => {
    
    const [extraData, setExtraData] = useState(false)

    return (
        <div style={{width: '10rem', borderStyle: 'solid', margin: '1rem', padding: '0.5rem', textAlign: 'center'}}>
            <h4>{pumpCode.name}</h4>
            <p>{formatCodeValue(pumpCode)}</p>
            <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg" onMouseEnter={() => setExtraData(true)} onMouseLeave={() => setExtraData(false)}>
                <circle cx="15" cy="15" r="15" style={{ fill: 'rgb(100,150,200)' }} />
                <circle cx="15" cy="15" r="13" style={{ fill: 'rgb(255,255,255)' }} />
                <rect x="12" y="22" height="2" width="6" style={{ fill: 'rgb(100,150,200)' }}></rect>
                <rect x="14" y="12" height="10" width="2" style={{ fill: 'rgb(100,150,200)' }}></rect>
                <rect x="12" y="12" height="2" width="6" style={{ fill: 'rgb(100,150,200)' }}></rect>
                <circle cx="15" cy="8" r="2" style={{ fill: 'rgb(100,150,200)' }} />
            </svg>
            {extraData && 
            <div style={{position: 'fixed', width: '10rem', backgroundColor: 'white', borderStyle: 'solid', textAlign: 'center'}}>
                <p>Code: {pumpCode.code}</p>
                <p>Type: {pumpCode.type}</p>
                <p>Raw: {pumpCode.raw_value}</p>
            </div>
            }
        </div>
    )
}