import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { TabProps, TabItem } from "./types/Tab.types";
import {getCurrentTheme} from '../util/themeHandler'

const tabStyless = {
    light: {
        headerBackground: { display: 'flex', justifyContent: 'center', backgroundColor: 'rgb(250,150,100)' },
        buttonFrame: { padding: '1rem' }
    },
    dark: {
        headerBackground: { display: 'flex', justifyContent: 'center', backgroundColor: 'rgb(100,100,100)' },
        buttonFrame: { padding: '1rem' }
    }
}

export const Tab = ({ _tabs}: TabProps) =>
{
    const [active, setActive] = useState(0) // index of active tab
    const [tabs, setTabs] = useState<TabItem[]>([])
    const [tabStyles, setTabStyles] = useState<any>({})

    useEffect(() => {
        setTabs(_tabs)
        setActive(0)
        setTabStyles(tabStyless[getCurrentTheme()])
    }, [])

    return (
        <div>
            <div style={tabStyles.headerBackground}>{tabs.map(({ Component, title }, i) => <div style={tabStyles.buttonFrame} key={i}><button onClick={() => setActive(i)}>{title}</button></div>)}</div>
            <div style={{display: 'block'}}>
                {tabs.map(({ Component, title }, i) => {
                    if (i === active) return <Component key={i}></Component>
                    return <div></div>
                })}
            </div>
        </div>
    )
}