import React from "react";
import { useEffect, useState } from "react";
import { CustomButton } from "../components/CustomButton";
import { backendUrl } from "../util/backendUrl";
import { LogResponse } from "../util/types/LogResponse";
import { PageProps } from "../util/types/PageProps";
import { RebootResponse } from "../util/types/RebootResponse";


export const MobileSettings: React.FC<PageProps>  = ({notify}) =>
{
    const [logs, setLogs] = useState<string[]>([])
    const [status, setStatus] = useState('loading')

    const getLog = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/getLog`)
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
            const response = await fetch(`${backendUrl}/api/getLog`)
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
            const response = await fetch(`${backendUrl}/api/restart`)
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
            <h3>Settings</h3>
            <div>
                <h4 style={{marginBottom: 2, marginLeft: 15}}>Pump Logs</h4>
                <div style={{
                    backgroundColor: 'rgb(240, 240, 204)',
                    paddingLeft: '1%',
                    borderStyle: 'solid',
                    borderRadius: '1rem',
                    width: '90%',
                    height: 300,
                    overflow: 'scroll',
                    marginLeft: '2%'
                }}>
                    {logs.map((log, key) => <p key={key} style={{margin: 1, fontFamily: 'monospace'}}>{log}</p>)}
                </div>
            </div>
            <div style={{marginTop: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CustomButton height='5rem' width='70%' onClick={() => initiateReboot()} text="Reboot H60 Gateway" />
            </div>
        </div>
    )
}