import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { TabProps, TabItem } from "./types/Tab.types";
import {getCurrentTheme} from '../util/themeHandler'

const tabStyless = {
    light: {
        headerBackground: { display: 'flex', justifyContent: 'center', backgroundColor: 'rgb(100,150,200)', height: '4rem' },
        buttonFrame: {marginLeft: '0.2rem', marginRight: '0.2rem' }
    },
    dark: {
        headerBackground: { display: 'flex', justifyContent: 'center', backgroundColor: 'rgb(100,100,100)' },
        buttonFrame: { padding: '1rem' }
    }
}

export const MobileTab = ({ _tabs}: TabProps) =>
{
    const [active, setActive] = useState(0) // index of active tab
    const [tabs, setTabs] = useState<TabItem[]>([])
    const [tabStyles, setTabStyles] = useState<any>({})
    const [notification, setNotification] = useState('')
    const [alpha, setAlpha] = useState(0)
    const [hightlightTitle, setHightlightTitle] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)

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

    const changeTab = (index: number) => {
        setActive(index)
        setMenuOpen(false)
    }

    const openMenu = () => {
        setMenuOpen(true)
    }

    return (
        <div>
            
            { notification !== '' &&
                <div style={{ position: 'fixed', marginTop: '2%', marginLeft: '75%', width: '20%', height: '20%', borderStyle: 'solid', borderColor: `rgba(0,0,0,${alpha})`, backgroundColor: `rgba(220,220,220,${alpha})`, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <p style={{color: `rgba(0,0,0,${alpha})`}}>{ notification }</p>
                </div>
            }

            
            
            {!menuOpen ?
                <div style={{ top: 0, position: 'sticky', height: '70px', backgroundColor: 'rgb(100,150,200)'}} onClick={() => openMenu()}>
                    <svg width="60" height="60">
                        <rect x="5" y="10" width="50" height="10" color="black"></rect>
                        <rect x="5" y="30" width="50" height="10" color="black"></rect>
                        <rect x="5" y="50" width="50" height="10" color="black"></rect>
                    </svg>
                </div>
                :
                <div>
                <div style={{top: 0, position: 'fixed', width: '100%', height: '70px', backgroundColor: 'rgb(100,150,200)'}}></div>
                <div style={{ top: 0, marginTop: 0, width: '100%', height: '100%', position: 'fixed', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '50%', height: '100%', backgroundColor: 'rgb(100,150,200)', paddingTop: '5%' }}>
                        {tabs.map(({ Component, title }, i) => <div style={tabStyles.buttonFrame} key={i}>
                            <button
                                onClick={() => changeTab(i)}
                                onMouseEnter={() => setHightlightTitle(title)}
                                onMouseLeave={() => setHightlightTitle('')}
                                style={{
                                    textDecoration: active === i ? 'underline' : 'none',
                                    borderStyle: 'none',
                                    fontSize: '24px',
                                    color: hightlightTitle === title || active === i ? 'white' : 'black',
                                    backgroundColor: hightlightTitle === title ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)',
                                    cursor: 'pointer',
                                    height: '4rem',
                                    marginTop: '10%',
                                    width: '100%'
                                }}
                            >{title}</button>
                        </div>
                        )}
                        <button
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    borderStyle: 'none',
                                    fontSize: '24px',
                                    color: 'black',
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    cursor: 'pointer',
                                    height: '4rem',
                                    marginTop: '40%',
                                    width: '100%'
                                }}
                            >Close</button>
                    </div>

                    <div onClick={() => setMenuOpen(false)} style={{ width: '50%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        
                    </div>
                </div>
                </div>
            }
            {menuOpen && <div style={{height: '70px'}}/>}
            <div style={{ display: 'block' }}>
                {tabs.map(({ Component, title }, i) => {
                    if (i === active) return <Component key={i} notify={displayNotification}></Component>
                    return <div></div>
                })}
            </div>
        </div>
    )
}