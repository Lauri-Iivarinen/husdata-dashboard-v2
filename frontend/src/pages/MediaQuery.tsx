import React, { useState, useEffect } from "react"
import { Dashboard } from './Dashboard';
import {Tab} from '../components/Tab'
import { Settings } from './Settings';
import { ListData } from './ListData';
import { Statistics } from './Statistics';
import { MobileTab } from "../components/MobileTab";
import { MobileDashboard } from "./MobileDashboard";
import { MobileSettings } from "./MobileSettings";
import { MobileStatistics } from "./MobileStatistics";
import { backendUrl } from "../util/backendUrl";


export const MediaQuery = () => {

    const [isMobile, setIsMobile] = useState(false)
    const [lastUpdate, setLastUpdate] = useState('')
 
    //choose the screen size 
    const handleResize = () => {
        if (window.innerWidth < 720) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    const checkUpdates = async () => {
        const prevUpdate = localStorage.getItem('previousUpdate')
        try {
            const response = await fetch(`${backendUrl}/api/updatelog`)
            const result = await response.text()
            if (prevUpdate !== result) {
                localStorage.setItem('previousUpdate', result)
                setLastUpdate(result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // create an event listener
    useEffect(() => {
        window.addEventListener("resize", handleResize)
        if (window.innerWidth < 720) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
        checkUpdates()
    }, [])


    return (
        <div style={{ margin: 0, padding: 0 }}>
            {lastUpdate.length !== 0 && <div onClick={() => setLastUpdate('')} style={{ height: '4rem', width: '100%', top: 0, backgroundColor: 'green' }}>
                <p style={{margin: 0, padding: 0, height: '100%'}}>New update, click to dismiss: {lastUpdate}</p>
            </div>}
            {isMobile ?
                <MobileTab
                    _tabs={[
                        { Component: MobileDashboard, title: 'Dashboard' },
                        { Component: ListData, title: 'All data' },
                        { Component: MobileStatistics, title: 'Statistics' },
                        { Component: MobileSettings, title: 'Settings' }
                    ]}
                ></MobileTab>
            :
                <Tab _tabs={[
                    { Component: Dashboard, title: 'Dashboard' },
                    { Component: ListData, title: 'All data' },
                    { Component: Statistics, title: 'Statistics' },
                    { Component: Settings, title: 'Settings' }
                ]}
                />
            }
        </div>
    )
}