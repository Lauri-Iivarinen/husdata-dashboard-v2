import React from "react";
import { AllowedThemes } from "../util/types/themeHandler.types";

export const Settings = () =>
{

    const setNewTheme = (theme: AllowedThemes) => {
        localStorage.setItem('theme', theme)
    }

    return (
        <div>
            <p>Settings page</p>
            <button onClick={() => setNewTheme('dark')}>DARK</button>
            <button onClick={() => setNewTheme('light')}>LIGHT</button>
        </div>
    )
}