import { AllowedThemes } from "./types/themeHandler.types"

export const getCurrentTheme = () : AllowedThemes =>
{
    let theme = localStorage.getItem('theme')
    theme = theme !== null ? theme : 'light'
    const returnTheme: AllowedThemes = theme !== 'light'? 'dark' : 'light'
    return returnTheme
}