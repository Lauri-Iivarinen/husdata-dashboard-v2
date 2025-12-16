import React, {useState, useEffect} from "react";
import { AverageListing } from "../components/AverageListing";
import { ChartListing } from "../components/ChartListing";
import { backendUrl } from "../util/backendUrl";
import { historyData } from "../util/types/historyData";
import { PageProps } from "../util/types/PageProps";


type chartType = 'bar' | 'line' | 'pie' | 'none'

export const MobileStatistics: React.FC<PageProps>  = ({notify}) => {

    const [values, setValues] = useState<historyData>({})
    const [status, setStatus] = useState('Loading...')
    const [activeTab, setActiveTab] = useState('averages')
    
    const fetchPumpData = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/getHistory`)
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
        <div style={{ paddingTop: '1%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                    style={{ backgroundColor: activeTab === 'averages' ? 'rgb(200,200,200)' : 'white', height: '4rem', textAlign: 'center', width: '45%', marginLeft: '2%', marginRight: '2%', borderBottomStyle: 'solid'}}
                    onClick={() => setActiveTab('averages')}
                >
                    <p>Averages</p>
                </div>
                <div
                    style={{ backgroundColor: activeTab === 'charts' ? 'rgb(200,200,200)' : 'white', height: '4rem', textAlign: 'center', width: '45%', marginLeft: '2%', marginRight: '2%', borderBottomStyle: 'solid'}}
                    onClick={() => setActiveTab('charts')}
                >
                    <p>Charts</p>
                </div>
            </div>
            <div style={{ width: '94%', marginLeft: '1%', marginRight: '1%', borderStyle: 'solid', padding: '1rem', borderColor: 'rgba(0,0,0,0.3)', marginTop: '2%' }}>
                {activeTab === 'averages' ? <AverageListing values={values} /> : <ChartListing width={20} height={185} chartWidthMultiplier={1.8} values={values} /> }
            </div>
            
        </div>
    )
}