import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { TabProps, TabItem } from "./types/Tab.types";
import {getCurrentTheme} from '../util/themeHandler'

const tabStyless = {
    light: {
        headerBackground: { display: 'flex', justifyContent: 'center', backgroundColor: 'rgb(100,150,200)', height: '4rem' },
        buttonFrame: { marginLeft: '0.2rem', marginRight: '0.2rem' }
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
    const [notification, setNotification] = useState('')
    const [alpha, setAlpha] = useState(0)
    const [hightlightTitle, setHightlightTitle] = useState('')

    useEffect(() => {
        setTabs(_tabs)
        setActive(0)
        setTabStyles(tabStyless[getCurrentTheme()])
    }, [])

    const hideNotification = (alphaVal: number) => {
        if (alphaVal <= 0) {
            setNotification('')
            return
        }
        setAlpha(alphaVal)
        setTimeout(() => hideNotification(alphaVal-0.04), 50)
    }

    const displayNotification = (noti: string, alphaVal: number = 1) => {
        setNotification(noti)
        setAlpha(alphaVal)
        setTimeout(() => hideNotification(alphaVal), 3000)
    }

    return (
        <div>
            { notification !== '' &&
                <div style={{ position: 'fixed', marginTop: '2%', marginLeft: '75%', width: '20%', height: '20%', borderStyle: 'solid', borderColor: `rgba(0,0,0,${alpha})`, backgroundColor: `rgba(220,220,220,${alpha})`, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <p style={{color: `rgba(0,0,0,${alpha})`}}>{ notification }</p>
                </div>
            }
            <div style={tabStyles.headerBackground}>{tabs.map(({ Component, title }, i) => <div style={tabStyles.buttonFrame} key={i}>
                <button
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setHightlightTitle(title)}
                    onMouseLeave={() => setHightlightTitle('')}
                    style={{textDecoration: active === i ? 'underline' : 'none', borderStyle: 'none', fontSize: '16px', paddingBottom: hightlightTitle === title ? '7px' : '0px', color: hightlightTitle === title || active === i ? 'white' : 'black', backgroundColor: hightlightTitle === title ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)', cursor: 'pointer', height: '100%'}}
                >{title}</button>
                </div>)}
            </div>
            <div style={{marginLeft: '1%', display: 'block'}}>
                {tabs.map(({ Component, title }, i) => {
                    if (i === active) return <Component key={i} notify={displayNotification}></Component>
                    return <div></div>
                })}
            </div>
        </div>
    )
}