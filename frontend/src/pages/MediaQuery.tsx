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


export const MediaQuery = () => {

    const [isMobile, setIsMobile] = useState(false)
 
    //choose the screen size 
    const handleResize = () => {
        if (window.innerWidth < 720) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
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
    }, [])


    return (
        <div style={{margin: 0}}>
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