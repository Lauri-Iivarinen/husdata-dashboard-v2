import React, {useState, useEffect} from 'react'

interface BarChartProps {
    keys: number[],
    values: number[]
    toolTipScale?: number
    graphHeight: number
}

interface dct {
    [id: string]: number
}

// This is a battle I might lose XD

export const PieChart = ({ keys, values, graphHeight, toolTipScale = 1 }: BarChartProps) => {

    const [data, setData] = useState([])
    const [tooltips, setTooltips] = useState([])

    useEffect(() => {
        const uniqueKeys: dct  = {}
        values.forEach(v => {
            let k = v.toString()
            if (Object.keys(uniqueKeys).includes(k)) uniqueKeys[k]++
            else uniqueKeys[k] = 1
        })
        const total = values.length

    }, [values])

    return (
        <svg>
            <circle></circle> 
        </svg>
    )
}