import React from "react";
import { PumpCode } from "../util/types/PumpCode";
import { ValueCardProps } from "./types/ValueCardProps";

// TODO, print out card like information for each code

export const ValueCard = ({pumpCode}: ValueCardProps) => {

    return (
        <div style={{width: '10rem', borderStyle: 'solid', margin: '1rem', padding: '0.5rem'}}>
            <p>{pumpCode.name}</p>
            <p>Code: {pumpCode.code}</p>
            <p>Value: {pumpCode.value}</p>
            <p>Raw: {pumpCode.raw_value}</p>
        </div>
    )
}