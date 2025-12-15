import React, {useState, useEffect} from "react";
import { CustomButton } from "../components/CustomButton";
import { backendUrl } from "../util/backendUrl";
import { PageProps } from "../util/types/PageProps";
import { PumpCode } from "../util/types/PumpCode";

export const ListData: React.FC<PageProps>  = ({notify}) => {
    const [values, setValues] = useState<PumpCode[]>([])
    const [status, setStatus] = useState('Loading...')
    const [overlayVisible, setOverlayVisible] = useState(false)
    const [modKey, setmodKey] = useState('')
    const [modValue, setModValue] = useState('')

    const fetchPumpData = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/getData`)
            const result: PumpCode[] = await response.json()
            //console.log(result)
            setValues(result)
            setStatus('')
        } catch (error) { 
            setStatus('Something went wrong')
        }
    }

    const uploadNewValue = async () => {
        const val = modValue.replace(',', '.')
        const response = await fetch(`${backendUrl}/api/setData/${modKey}?value=${val}`)
        const result = await response.json()
        if (result.status === 'ok') {
            setOverlayVisible(false)
            notify('updated successfully')
            fetchPumpData()
        }
        console.log(result)
    }

    const openUpdateValue = (code: string, value: any) => {
        setmodKey(code)
        setModValue(value)
        setOverlayVisible(true)
    }

    useEffect(() => {
        fetchPumpData()
    }, [])

    if (status.length > 0) return <p>{status}</p>
    return (
        <div>
            {overlayVisible &&
                <div style={{ top: 0, position: 'fixed', width: '100%', height: '100%', backgroundColor: 'rgba(200,200,200, 0.6)', justifyContent: 'center', alignItems: 'center', display: 'flex' }} onClick={() => setOverlayVisible(false)}>
                    <div onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', paddingLeft: '5%', width: '60%', height: '60%', backgroundColor: 'rgb(255,255,255)'}}>
                        <h4>Update</h4>
                        <p>{modKey}</p>
                    <input value={modValue} onChange={(e) => setModValue(e.target.value)}></input>
                    <div style={{marginTop: '5%', width: '70%'}}><CustomButton width='70%' onClick={() => uploadNewValue()} text="SAVE" /></div>
                    </div>
                </div>
            }
            <h3>All data</h3>
            <div>
                <table style={{ borderCollapse: 'collapse', marginBottom: '5rem'}}>
                    <thead>
                        <tr>
                            <th style={{paddingLeft: '0rem', paddingRight: '3rem', width: '4rem', textAlign: 'start'}}>Code</th>
                            <th style={{paddingLeft: '0rem', paddingRight: '3rem', width: '9rem', textAlign: 'start'}}>Name</th>
                            <th style={{paddingLeft: '0rem', paddingRight: '3rem', width: '4rem', textAlign: 'start'}}>Value</th>
                            <th style={{paddingLeft: '0rem', paddingRight: '3rem', width: '9rem', textAlign: 'start'}}>Type</th>
                            <th style={{paddingLeft: '0rem', paddingRight: '3rem', width: '4rem', textAlign: 'start'}}> Set</th>
                        </tr>
                    </thead>
                    <tbody>
                        {values.map((value, key) => <tr style={{ backgroundColor: key % 2 === 0 ? 'rgb(230,230,230)' : 'rgb(255,255,255)'}} key={key}>
                                <td>{value.code}</td>
                                <td>{value.name}</td>
                                <td>{value.value}</td>
                                <td>{value.type}</td><td>
                                { !['Temp Sensor', 'Percent usage', 'Status', 'Time Hours', 'Number'].includes(value.type) &&
                                    <CustomButton width="100%" onClick={() => openUpdateValue(value.code, value.value)} text="Change" />
                                }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
            </div>
        </div>
    )
}