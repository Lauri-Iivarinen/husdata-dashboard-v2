import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { ValueCard } from '../components/ValueCard'
import { PumpCode } from '../util/types/PumpCode'

export const Dashboard = () =>
{
    const [values, setValues] = useState<PumpCode[]>([])
    const [status, setStatus] = useState('Loading...')
    const [filteredValues, setFilteredValues] = useState<string[]>([])
    const [filterVisible, setFilterVisible] = useState(false)

    const fetchPumpData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/getData')
            const result: PumpCode[] = await response.json()
            //console.log(result)
            setValues(result)
            setStatus('')
        } catch (error) {
            setStatus('Something went wrong')
        }
    }

    const saveFilters = (vals: string[]) => {
        const valStr = vals.join(';')
        localStorage.setItem('dashboardFilters', valStr)
    }

    const refreshFilter = (val: string) => {
        let newFilter = []

        if (filteredValues.includes(val)) newFilter = filteredValues.filter(v => v !== val)
        else newFilter = [val, ...filteredValues]

        setFilteredValues(newFilter)
        saveFilters(newFilter)
    }

    const loadFilters = () => {
        const valStr = localStorage.getItem('dashboardFilters')
        if (valStr !== null) {
            const vals = valStr.split(';')
            setFilteredValues(vals)
        } else {
            const defaultValues = ['Radiator Return', 'Radiator Forward', 'Heating setpoint']
            setFilteredValues(defaultValues)
            saveFilters(defaultValues)
        }
    }

    useEffect(() => {
        fetchPumpData()
        loadFilters()
    }, [])

    if (status.length > 0) return <p>{status}</p>

    return (
        <div>
            <p>Dashboard</p>
            <div>
                <button onClick={() => setFilterVisible(!filterVisible)}>{filterVisible ? 'Close Filters' : 'Open Filters'}</button>
                {filterVisible &&
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {values.map((value, key) => <div key={key} style={{borderStyle: 'solid', margin: '0.3rem', padding: '0.2rem'}}><input checked={filteredValues.includes(value.name)} onChange={() => refreshFilter(value.name)} type="checkbox" /> {value.name}</div>)}
                    </div>
                }
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', width: '100%'}}>
                {values.map((value, key) => {
                    if (filteredValues.includes(value.name)) return <ValueCard key={key} pumpCode={value}></ValueCard>
                })}
            </div>
        </div>
    )
}
    

