import React, {useState, useEffect} from "react";

import { BarChart } from "../components/BarChart";
import { LineChart } from "../components/LineChart";
import { getCodeType } from "../util/getCodeType";
import { historyData } from "../util/types/historyData";
import { PageProps } from "../util/types/PageProps";


type chartType = 'bar' | 'line' | 'pie' | 'none'

export const Statistics: React.FC<PageProps>  = ({notify}) => {

    const [values, setValues] = useState<historyData>({})
    const [status, setStatus] = useState('Loading...')
    const [chartType, setChartType] = useState('bar')
    const [chartSelector, setChartSelector] = useState('0007')
    const [secondChartType, setSecondChartType] = useState('none')
    const [secondChartSelector, setSecondChartSelector] = useState('0001')

    const fetchPumpData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/getHistory')
            const result: historyData = await response.json()
            setStatus('')
            setValues(result)
        } catch (error) {
            setStatus('Something went wrong')
        }
    }

    const getValueRange = (v: number) => {
        const ct = getCodeType(chartSelector)
        // TODO: come up with smth clever
        if (ct === 'temp') return v / 10
        return v
    }

    useEffect(() => {
        fetchPumpData()
    }, [])


    if (status.length > 0) return <p>{status}</p>

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            { /* <BarChart keys={values['timestamps']} values={values['0001']} graphHeight={500}></BarChart> */}
            <div style={{width: '30%'}}>
                <p>key values and some averages here</p>
            </div>

            <div style={{width: '70%'}}>
            <select name="graphType" onChange={(e) => setChartType(e.target.value)}>
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
            </select>
            <select name="graphData" onChange={(e) => setChartSelector(e.target.value)}>
                {Object.keys(values).map((v, k) => {
                    if (v === 'timestamps') return <div key={k}/>
                    return <option key={k} value={v}>{v}</option>
                })}
            </select>
            {chartType === 'bar' &&
                <BarChart keys={values['timestamps']} values={values[chartSelector].map(getValueRange)} toolTipScale={1} graphHeight={400} />
            }
            {chartType === 'line' &&
                <LineChart keys={values['timestamps']} values={values[chartSelector].map(getValueRange)} toolTipScale={1} graphHeight={400} />
            }
            {chartType === 'pie' &&
                <p>WIP lol</p>
            }

            <select name="graphType" onChange={(e) => setSecondChartType(e.target.value)}>
                <option value="none">None</option>
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
            </select>
            <select name="graphData" onChange={(e) => setSecondChartSelector(e.target.value)}>
                {Object.keys(values).map((v, k) => {
                    if (v === 'timestamps') return <div key={k}/>
                    return <option key={k} value={v}>{v}</option>
                })}
            </select>
            {secondChartType === 'bar' &&
                <BarChart keys={values['timestamps']} values={values[secondChartSelector].map(getValueRange)} toolTipScale={1} graphHeight={400} />
            }
            {secondChartType === 'line' &&
                <LineChart keys={values['timestamps']} values={values[secondChartSelector].map(getValueRange)} toolTipScale={1} graphHeight={400} />
            }
            {secondChartType === 'pie' &&
                <p>WIP lol</p>
            }
            </div>
        </div>
    )
}