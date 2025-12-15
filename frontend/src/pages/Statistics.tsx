import React, {useState, useEffect} from "react";
import { AverageListing } from "../components/AverageListing";

import { ChartListing } from "../components/ChartListing";

import { codeToName, getCodeType } from "../util/getCodeType";
import { historyData } from "../util/types/historyData";
import { PageProps } from "../util/types/PageProps";


type chartType = 'bar' | 'line' | 'pie' | 'none'

export const Statistics: React.FC<PageProps>  = ({notify}) => {

    const [values, setValues] = useState<historyData>({})
    const [status, setStatus] = useState('Loading...')
    
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

    useEffect(() => {
        fetchPumpData()
    }, [])

    
    if (status.length > 0) return <p>{status}</p>

    return (
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '1%'}}>
            <div style={{ width: '28%', marginLeft: '1%', marginRight: '1%', borderStyle: 'solid', padding: '1rem', borderColor: 'rgba(0,0,0,0.3)' }}>
                <AverageListing values={values} />
            </div>
            <div style={{ width: '70%', borderStyle: 'solid', padding: '1rem', borderColor: 'rgba(0,0,0,0.3)' }}>
                <ChartListing values={values} />
            </div>
            
        </div>
    )
}