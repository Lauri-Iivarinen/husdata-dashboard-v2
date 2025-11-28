import React, { useEffect, useState } from 'react'

interface BarChartProps {
    keys: number[],
    values: number[]
    toolTipScale?: number
    graphHeight: number
}

interface Column {
    width: number
    height: number
    x: number
    y: number
    value: string | number | null
    padding: string
    timeStamp: string
    coords?: string
}

export const BarChart = ({ keys, values, graphHeight, toolTipScale = 1 }: BarChartProps) => {
    
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
        const centerY = graphHeight - 80
        const middleY = graphHeight - 60
        const bottomY = middleY + 50
        return `${centerX},${centerY} ${rightX},${middleY} ${rightX},${bottomY} ${leftX},${bottomY} ${leftX},${middleY}`
    }
    //const graphHeight = 600

    const [bars, setBars] = useState<Column[]>([])
    const [range, setRange] = useState<Column[]>([])
    const [hoverInd, setHoverInd] = useState<number>(-1)
    const [activeBar, setActiveBar] = useState<null | Column>(null)
    const bottomPadding = 80
    const leftPadding = 100

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
        
        const columns = keys.length * 2 + 1
        const chartWidth = graphHeight * 2.5
        const barWidth = ( chartWidth - leftPadding ) / columns // Single bar width, every other "bar" actually shows data, rest are gaps
        const max = getMaxValue(values)
        const min = getMinValue(values)

        // TODO: DEBUG FUNC, where does the padding for negative numbers come from?? - MINOR
        const zero = graphHeight - bottomPadding - getBelowZero(min, max, graphHeight - bottomPadding)
        const zeropoint = zero

        const rangeList: Column[] = min < 0 ? generateHorizontalLines(max, zero).concat(generateHorizontalLines(max, zero, true)) : generateHorizontalLines(max, zero)
        setRange(rangeList)
        
        let x = leftPadding
        for (let i = 0; i < columns; i++){
            if (i % 2 === 1) {
                const valInd = (i + 1) / 2 - 1
                const val = values[valInd]
                const barHeightPercent = (val / max) * 0.9
                
                const barHeight = zero - zero * barHeightPercent
                //console.log(val, barHeight)

                const x1 = x
                const x2 = x + barWidth * 1.5
                const y1 = zeropoint
                const y2 = barHeight
                const coords = `${x1},${y1} ${x1},${y2} ${x2},${y2} ${x2},${y1}`
                barList.push({
                    x: x,
                    y: zero - barHeight,
                    width: barWidth,
                    height: barHeight,
                    value: (val / toolTipScale).toFixed(1),
                    timeStamp: convertToTimeStamp(keys[valInd]),
                    padding: `${0}`,
                    coords: coords
                })
                x += barWidth * 1.5
            } else {
                x += barWidth * 0.5
            }
            
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
                <svg height={graphHeight} width={graphHeight * 2.5 + 10} xmlns="http://www.w3.org/2000/svg" style={{ borderStyle: 'none' }}>
                    {range.map((line, key) =>
                        <line key={key} x1={line.x} y1={line.y} x2={graphHeight * 2.5} y2={line.y} style={{  stroke: line.value === 0 ? 'rgb(0,0,0)' :'rgb(200,200,200)' }} />
                    )}
                    {range.map((line, key) => <text key={key} x={line.x - line.width * 2} y={line.y + 5}>{line.value}</text>)}
                    {bars.length > 2 &&
                        <svg>
                            <text x={leftPadding} y={graphHeight - bottomPadding / 2}>{bars[0].timeStamp.split(' ')[0]}</text>
                            <text x={leftPadding} y={graphHeight - bottomPadding/2+15}>{bars[0].timeStamp.split(' ')[1]}</text>
                            <text x={graphHeight * 2.5 - 80} y={graphHeight - bottomPadding / 2}>{bars[bars.length-1].timeStamp.split(' ')[0]}</text>
                            <text x={graphHeight * 2.5 - 45} y={graphHeight - bottomPadding/2+15}>{bars[bars.length-1].timeStamp.split(' ')[1]}</text>
                        </svg>
                    }
                    {bars.map((bar, key) =>
                        <polygon
                            onMouseEnter={() => setHoverInd(key)}
                            onMouseLeave={() => setHoverInd(-1)}
                            key={key} 
                            points={bar.coords}
                            style={{
                                fill: 'rgb(100,150,200)',
                                stroke: hoverInd === key ? 'black' : 'none',
                            }}
                        />
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
                        x2={graphHeight * 2.5}
                        y2={graphHeight-bottomPadding}
                        style={{ stroke: 'black', width: 2 }}
                    />
                    
                    {activeBar !== null &&
                        <svg>
                        <polygon points={triangulate(activeBar)} stroke={'black'} fill={'white'}></polygon>
                        {/*<rect x={activeBar.x - (50-activeBar.width) / 2} y={graphHeight-60} height={50} width={50} style={{fill: 'rgb(180,180,180)'}}></rect> */}
                            <text x={activeBar.x + activeBar.width / 2 - 12} y={graphHeight - 40}>{activeBar.value}</text>
                            <text x={activeBar.x + activeBar.width / 2 - 18} y={graphHeight - 25}>{activeBar.timeStamp.split(' ')[1]}</text>  
                        </svg>
                    }
                </svg>
            </div>
        </div>
    )
}