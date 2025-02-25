import React, { createContext, useState } from 'react';

// Create a context
const Context = createContext();

export function ContextProvider({ children }) {

    // Menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const menuCloseHandler = () => {
        setIsMenuOpen(false);
    }
    // Menu

    // Bottom Sheet
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isSheetId, setIsSheetId] =  useState(null)

    const sheetOpenHandler = (id) => {
        setIsSheetId(id);
        setIsSheetOpen(true);
    } 

    const sheetCloseHandler = () => {
        setIsSheetOpen(false);
        setIsSheetOpen(null);
    } 
    // Bottom Sheet


    return (
        <Context.Provider value={{ toggleMenu, menuCloseHandler, isMenuOpen, isSheetOpen, sheetOpenHandler, sheetCloseHandler, isSheetId }}>
            {children}
        </Context.Provider>
    );
}

export default Context;
