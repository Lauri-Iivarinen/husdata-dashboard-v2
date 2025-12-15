import React, { useEffect, useState } from 'react'
import { BarChartProps } from './types/BartChartProps'
import { Column } from './types/Column'


export const LineChart = ({ keys, values, graphHeight, toolTipScale = 1, leftPadding = 100 }: BarChartProps) => {
    
    // TODO: NEGATIVE VALUES ARE AN ISSUE

    const getMaxValue = (vals: number[]) => vals.slice().sort((a, b) => b - a)[0]
    const getMinValue = (vals: number[]) => vals.slice().sort((a, b) => a - b)[0]

    const convertToTimeStamp = (ts: number) => {
        const dt = new Date(ts*1000)
        return `${dt.getDate()}.${dt.getMonth()+1}.${dt.getFullYear()} ${dt.getHours() < 10 ? `0${dt.getHours()}` : dt.getHours()}:${dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes()}`
    }

    const triangulate = (bar: Column) => {
        const centerX = bar.x + bar.width / 2
        const leftX = centerX - 25
        const rightX = centerX + 25
        const centerY = bar.y + 20
        const middleY = bar.y + 40
        const bottomY = middleY + 50
        return `${centerX},${centerY} ${rightX},${middleY} ${rightX},${bottomY} ${leftX},${bottomY} ${leftX},${middleY}`
    }
    //const graphHeight = 600

    const [bars, setBars] = useState<Column[]>([])
    const [range, setRange] = useState<Column[]>([])
    const [hoverInd, setHoverInd] = useState<number>(-1)
    const [activeBar, setActiveBar] = useState<null | Column>(null)
    const bottomPadding = 80
    const widthMultiplier = 2.5

    const generateHorizontalLines = (max: number, zero: number, negative = false) => {
        const rangeList: Column[] = []
        // Calculate how many data scale / header lines we create
        const lineGap = max > 10 * toolTipScale ? 5 : 1
        const leftover = max % (lineGap * toolTipScale)
        const gaps = (max - leftover) / (lineGap * toolTipScale)

        // Generate the horizontal lines
        for (let i = 0; i <= gaps; i++) {
            const val = (lineGap * toolTipScale) * i
            const barHeightPercent = (val / max) * 0.9
            const barHeight = zero * barHeightPercent
            const lineWidth = 10
            if (!negative || zero + barHeight < graphHeight-leftPadding) {
                rangeList.push({
                    x: leftPadding - lineWidth,
                    y: negative ? zero + barHeight : zero - barHeight,
                    width: lineWidth,
                    height: 2,
                    value: negative ? i * lineGap * -1 : i * lineGap,
                    timeStamp: '',
                    padding: ''
                })
            }
        }
        return rangeList
    }

    const getBelowZero = (min: number, max: number, height: number) => {
        if (min < 0) {
            const posMin = min * -1
            
            if (posMin > max) { // debug this still
                const negHeight = height * (1 - max / posMin)
                return negHeight
            } else {
                const posHeight = height * (1 - posMin / max)
                const negHeight = height - posHeight
                return negHeight
            }
        }

        return 0
    }

    useEffect(() => {
        const barList: Column[] = []
        
        const columns = keys.length
        const chartWidth = graphHeight * widthMultiplier
        const barWidth = ( chartWidth - leftPadding ) / columns // Single bar width, every other "bar" actually shows data, rest are gaps
        const max = getMaxValue(values)
        const min = getMinValue(values)

        // TODO: DEBUG FUNC, where does the padding for negative numbers come from?? - MINOR
        const zero = graphHeight - bottomPadding - getBelowZero(min, max, graphHeight - bottomPadding)
        const zeropoint = zero

        const rangeList: Column[] = min < 0 ? generateHorizontalLines(max, zero).concat(generateHorizontalLines(max, zero, true)) : generateHorizontalLines(max, zero)
        setRange(rangeList)
        const radius = 4.5
        let x = leftPadding + radius
        for (let i = 0; i < columns; i++){
            const val = values[i]
            const barHeightPercent = (val / max) * 0.9
            
            const barHeight = zero - zero * barHeightPercent
            barList.push({
                x: x,
                y: barHeight,
                width: radius,
                height: 0, // Not in use atm
                value: (val / toolTipScale).toFixed(1),
                timeStamp: convertToTimeStamp(keys[i]),
                padding: `${0}`,
                prevX: i === 0 ? 0 : barList[i-1].x,
                prevY: i === 0 ? 0 : barList[i-1].y
            })

            x += barWidth
            
        }
        setBars(barList)
    }, [values])

    useEffect(() => {
        if (hoverInd !== -1) setActiveBar(bars[hoverInd])
        else setActiveBar(null)
    }, [hoverInd])
  
    if (bars.length === 0) return <div></div>

    return (
        <div style={{margin: '1%'}}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg height={graphHeight} width={graphHeight * widthMultiplier + 20} xmlns="http://www.w3.org/2000/svg" style={{ borderStyle: 'none' }}>
                    {range.map((line, key) =>
                        <line key={key} x1={line.x} y1={line.y} x2={graphHeight * widthMultiplier} y2={line.y} style={{ stroke: line.value === 0 ? 'rgb(0,0,0)' :'rgb(200,200,200)' }} />
                    )}
                    {range.map((line, key) => <text key={key} x={line.x - line.width * widthMultiplier} y={line.y + 5}>{line.value}</text>)}
                    {bars.length > 2 &&
                        <svg>
                            <text x={leftPadding} y={graphHeight - bottomPadding / 2}>{bars[0].timeStamp.split(' ')[0]}</text>
                            <text x={leftPadding} y={graphHeight - bottomPadding/2+15}>{bars[0].timeStamp.split(' ')[1]}</text>
                            <text x={graphHeight * widthMultiplier - 80} y={graphHeight - bottomPadding / 2}>{bars[bars.length-1].timeStamp.split(' ')[0]}</text>
                            <text x={graphHeight * widthMultiplier - 45} y={graphHeight - bottomPadding/2+15}>{bars[bars.length-1].timeStamp.split(' ')[1]}</text>
                        </svg>
                    }
                    {bars.map((bar, key) =>
                        <svg>
                            <circle
                            onMouseEnter={() => setHoverInd(key)}
                            onMouseLeave={() => setHoverInd(-1)}
                            key={key} 
                            cx={bar.x}
                            cy={bar.y}
                            r={bar.width}
                            style={{
                                fill: 'rgb(100,150,200)',
                                stroke: hoverInd === key ? 'black' : 'none',
                            }}
                            />
                            {key !== 0 && <line x1={bar.x} y1={bar.y} x2={bar.prevX} y2={bar.prevY} style={{ stroke: 'rgb(100,150,200)', width: 2 }} />}
                        </svg>
                    )}
                    <line
                        x1={leftPadding}
                        y1={0}
                        x2={leftPadding}
                        y2={graphHeight-bottomPadding}
                        style={{ stroke: 'black', width: 2 }}
                    />
                    <line
                        x1={leftPadding}
                        y1={graphHeight - bottomPadding}
                        x2={graphHeight * widthMultiplier}
                        y2={graphHeight-bottomPadding}
                        style={{ stroke: 'black', width: 2 }}
                    />
                    
                    {activeBar !== null &&
                        <svg>
                        <polygon points={triangulate(activeBar)} stroke={'black'} fill={'white'}></polygon>
                        {/*<rect x={activeBar.x - (50-activeBar.width) / 2} y={graphHeight-60} height={50} width={50} style={{fill: 'rgb(180,180,180)'}}></rect> */}
                            <text x={activeBar.x + activeBar.width / 2 - 12} y={activeBar.y + 55}>{activeBar.value}</text>
                            <text x={activeBar.x + activeBar.width / 2 - 18} y={activeBar.y + 80}>{activeBar.timeStamp.split(' ')[1]}</text>  
                        </svg>
                    }
                </svg>
            </div>
        </div>
    )
}