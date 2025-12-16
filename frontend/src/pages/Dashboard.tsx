import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { BarChart } from '../components/BarChart'
import { CustomButton } from '../components/CustomButton'
import { GraphDataPoint } from '../components/types/GraphDataPoint'
import { ValueCard } from '../components/ValueCard'
import { backendUrl } from '../util/backendUrl'
import { ElectricityPrices } from '../util/types/ElectricityPrices'
import { PageProps } from '../util/types/PageProps'
import { PumpCode } from '../util/types/PumpCode'

export const Dashboard: React.FC<PageProps> = ({notify}) =>
{
    const [values, setValues] = useState<PumpCode[]>([])
    const [status, setStatus] = useState('Loading...')
    const [filteredValues, setFilteredValues] = useState<string[]>([])
    const [filterVisible, setFilterVisible] = useState(false)
    const [heatingSetpoint, setHeatingSetpoint] = useState(0)
    const [sliderValue, setSliderValue] = useState(170)

    const [electricityTs, setElectricityTs] = useState<number[]>([])
    const [electricityVals, setElectricityVals] = useState<number[]>([])
    const setpointCode = '2205'

    const fetchPumpData = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/getData`)
            const result: PumpCode[] = await response.json()
            //console.log(result)
            
            setValues(result)
            const setpoint = result.find(v => v.code === setpointCode)
            if (setpoint !== undefined) {
                setHeatingSetpoint(setpoint.raw_value)
                setSliderValue(setpoint.raw_value)
            }
            setStatus('')
        } catch (error) {
            setStatus('Something went wrong')
        }
    }

    // Turns out the data cannot be fetched...
    const fetchElectricityPrice = async () => {
        try {
            const responseToday = await fetch(`${backendUrl}/api/sahko/1`)
            const resultToday: ElectricityPrices = await responseToday.json()
            const responseTomorrow = await fetch(`${backendUrl}/api/sahko/2`)
            const resultTomorrow: ElectricityPrices = await responseTomorrow.json()

            const pricelist: GraphDataPoint[] = [...resultToday.hour, ...resultTomorrow.hour].map(value => {
                const dt = new Date(value.time)
                return { key: dt.getTime() / 1000, value: value.value }
            })
            setElectricityTs(pricelist.map(v => v.key))
            setElectricityVals(pricelist.map(v => v.value))
        } catch (e) {
            console.log(e)
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

    const saveNewSetpoint = async () => {
        const val = sliderValue
        const response = await fetch(`${backendUrl}/api/setData/${setpointCode}?value=${val}`)
        const result = await response.json()
        console.log(result)
        if (result.status === 'ok') {
            notify('updated successfully')
            fetchPumpData()
        } else {
            notify('Something went wrong')
        }
    }

    const resetSlider = () => {
        setSliderValue(heatingSetpoint)
    }

    useEffect(() => {
        fetchPumpData()
        loadFilters()
        fetchElectricityPrice()
    }, [])

    if (status.length > 0) return <p>{status}</p>

    return (
        <div style={{marginBottom: '3rem'}}>
            <p>Dashboard</p>
            <div>
                <CustomButton onClick={() => setFilterVisible(!filterVisible)} text={filterVisible ? 'Close Filters' : 'Open Filters'}/>
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
            <div style={{display: 'flex', borderStyle: 'solid', padding: '1%'}}>
                <div style={{ width: '50%' }}>
                    <h3 style={{textAlign: 'center'}}>Heating Setpoint</h3>
                    <p style={{textAlign: 'center'}}>{sliderValue / 10}</p>
                    <label>1</label>
                    <input type="range" style={{width: '90%'}} min="10" max="50" value={sliderValue} onChange={(e) => setSliderValue(Math.round(Number(e.target.value)))}></input>
                    <label>5</label>
                    {heatingSetpoint !== sliderValue &&
                        <div style={{}}>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CustomButton onClick={() => resetSlider()} text="RESET SLIDER" />
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CustomButton onClick={() => saveNewSetpoint()} text="SAVE NEW VALUE" />
                            </div>
                        </div>
                    }
                </div>
                <div style={{ width: '50%' }}>
                    <BarChart keys={electricityTs} values={electricityVals} graphHeight={300} toolTipScale={1} rounding={2}></BarChart>
                    <div style={{marginLeft: '10%', textAlign: 'center'}}>
                        <a style={{color: 'black'}} href="https://www.porssisahkoa.fi/" target="_blank">Electricity (c/kWh)</a>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
    

