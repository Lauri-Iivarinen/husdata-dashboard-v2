import React from "react";
import { useEffect, useState } from "react";
import { LogResponse } from "../util/types/LogResponse";
import { PageProps } from "../util/types/PageProps";
import { RebootResponse } from "../util/types/RebootResponse";


export const Settings: React.FC<PageProps>  = ({notify}) =>
{
    const [logs, setLogs] = useState<string[]>([])
    const [status, setStatus] = useState('loading')

    const getLog = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/getLog')
            const result: LogResponse = await response.json()
            setStatus('')
            setLogs(result['msg'])
        } catch (error) {
            setStatus('Something went wrong')
        }
    }

    const checkRebootStatus = async (logs: string[] = []) => {
        setLogs(['Rebooting...', ...logs])
        try {
            const response = await fetch('http://localhost:8080/api/getLog')
            const result: LogResponse = await response.json()
            if (result.status === 'ok') {
                setStatus('')
                setLogs(result['msg'])
            } else setTimeout(() => checkRebootStatus(logs), 5000)
        } catch (error) {
            setStatus('Something went wrong')
        }
    }

    const initiateReboot = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/restart')
            const result: RebootResponse = await response.json()
            if (result.status === 'ok') {
                setLogs(['Rebooting...'])
                setTimeout(() => checkRebootStatus(['Rebooting...']), 5000)
            }
        } catch (error) {
            setStatus('Something went wrong')
        }
    }

    useEffect(() => {
        getLog()
    }, [])

    if (status.length > 0) return (<p>{status}</p>)
    
    return (
        <div>
            <p>Settings page</p>
            
            <div>
                <h3 style={{marginBottom: 2, marginLeft: 15}}>Pump Logs</h3>
                <div style={{
                    backgroundColor: 'rgb(240, 240, 204)',
                    paddingLeft: '1%',
                    borderStyle: 'solid',
                    borderRadius: '1rem',
                    width: '50%',
                    height: 300,
                    overflow: 'scroll'
                }}>
                    {logs.map((log, key) => <p key={key} style={{margin: 1, fontFamily: 'monospace'}}>{log}</p>)}
                </div>
            </div>
            <div>
                <button onClick={() => initiateReboot()}>Reboot H60 Gateway</button>
            </div>
        </div>
    )
}