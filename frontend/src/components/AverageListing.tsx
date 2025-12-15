import React, {useState} from "react"
import { codeToName, getCodeType } from "../util/getCodeType"
import { historyData } from "../util/types/historyData"
import { CustomButton } from "./CustomButton"
import { DataListingProps } from "./types/DataListingProps"


export const AverageListing = ({ values }: DataListingProps) => {
    
    const [averageList, setAverageList] = useState<string[]>([])

    const refreshAverageList = (i: number, e: React.ChangeEvent<HTMLSelectElement>) => {
        averageList[i] = e.target.value
        setAverageList([...averageList])
    }

    const getValueRange = (v: number, c: string) => {
        const ct = getCodeType(c)
        // TODO: come up with smth clever
        if (ct === 'temp') return v / 10
        return v
    }

    const calcAverages = (code: string, nums: number[] = [], count: number = 3): number[] => {
        if (count < 0) {
            console.log(nums, 'avgs')
            return nums
        }
        
        try {
            
            const dataset = values[code]
            if (count * 24 > dataset.length) return nums
            let sliced = dataset.slice(dataset.length - (dataset.length - 24 * count))
            const sum = sliced.reduce((a: any, b: any) => a + b)
            nums.push(sum / sliced.length)
        } catch (error) {
            console.log(error)
            return []
        }
        count = count - 1
        return calcAverages(code, nums, count)
    }
    return (
        <div>
            <h4 style={{textAlign: 'center'}}>AVERAGES</h4>
            {averageList.map((code, i) => <div key={i}
                style={{borderStyle: 'solid', marginBottom: '1rem', padding: '1rem'}}
                >
                <select name="graphData" defaultValue='' onChange={(e) => refreshAverageList(i, e)}>
                    {Object.keys(values).map((v, k) => {
                        if (v === 'timestamps') return <option key={k}/>
                        return <option key={k} value={v}>{codeToName(v)}</option>
                    })}
                </select>
                <div>{code.length > 0 ? calcAverages(code).map((val, key) => <p key={key}>Last {(key + 1) * 6} hours: {getValueRange(val, code).toFixed(1)}</p>) : ''}</div>
                </div>
            )}
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem' }}>
                <CustomButton onClick={() => setAverageList([...averageList, ''])} text="Add Average"/>
            </div>
        </div>
    )
}