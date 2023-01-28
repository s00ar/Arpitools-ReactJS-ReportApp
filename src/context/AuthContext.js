import React, { createContext, useState, useEffect } from 'react'


export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState({})

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')) || {})
    }, []);

    function login(user) {
        localStorage.setItem('user', JSON.stringify(user))
        setUser({ ...user })
    }

    function logout() {
        localStorage.removeItem('user')
        setUser({})
    }

    return <AuthContext.Provider value={{ user, login, logout }}>
        {children}
    </AuthContext.Provider>
}
