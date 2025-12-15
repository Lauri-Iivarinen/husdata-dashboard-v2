import React, {useState} from "react";
import { CustomButton } from "../components/CustomButton";
import { LineChart } from "../components/LineChart";
import { BarChart } from "../components/BarChart";
import { codeToName, getCodeType } from "../util/getCodeType";
import { AverageListingProps } from "./AverageListing";

export const ChartListing = ({values, width, height}: AverageListingProps) => {
    
    const [chartList, setChartList] = useState<string[][]>([])

    const getValueRange = (v: number, c: string) => {
        const ct = getCodeType(c)
        // TODO: come up with smth clever
        if (ct === 'temp') return v / 10
        return v
    }

    const refreshChartList = (i: number, chartCode: React.ChangeEvent<HTMLSelectElement> | null, chartType:  React.ChangeEvent<HTMLSelectElement> | null) => {
        chartList[i][0] = chartCode !== null ? chartCode.target.value : chartList[i][0]
        chartList[i][1] = chartType !== null ? chartType.target.value : chartList[i][1]
        setChartList([...chartList])
    }

    return (
        <div>
                <h4 style={{textAlign: 'center'}}>CHARTS</h4>
                <div>
                    {chartList.map((code, index) => 
                    <div key={index} style={{ width: '100%' }}>
                    <select style={{marginLeft: '12%',marginRight: '1%'}} name="graphType" onChange={(e) => refreshChartList(index, null, e)}>
                        <option value="bar">Bar</option>
                        <option value="line">Line</option>
                        <option value="pie">Pie</option>
                    </select>
                    <select name="graphData" onChange={(e) => refreshChartList(index, e, null)}>
                        {Object.keys(values).map((v, k) => {
                            if (v === 'timestamps') return <option key={k}/>
                            return <option key={k} value={v}>{codeToName(v)},{v}</option>
                        })}
                    </select>
                    {code[1] === 'bar' && code[0].length > 0 &&
                        <BarChart leftPadding={width ? width : 100} keys={values['timestamps']} values={values[code[0]].map(v => getValueRange(v, code[0]))} toolTipScale={1} graphHeight={height ? height : 400} />
                    }
                    {code[1] === 'line' && code[0].length > 0 &&
                        <LineChart keys={values['timestamps']} values={values[code[0]].map(v => getValueRange(v, code[0]))} toolTipScale={1} graphHeight={height ? height : 400} />
                    }
                    {code[1] === 'pie' && code[0].length > 0 &&
                        <p>WIP lol</p>
                    }
                    </div>
                    )}
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CustomButton onClick={() => setChartList([...chartList, ['', 'bar']])} text="Add Chart" />
                </div>
                </div>
    )
}