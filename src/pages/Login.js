import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { baseURL } from '../utils';
import { useNavigate } from "react-router-dom";
import '../App.css';




export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)

    const toast = useRef(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (email !== '' && password !== '') {
                const { data } = await axios.post(baseURL + '/api/auth/local', {
                    identifier: email,
                    password: password
                })
                login({ ...data })
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid username or password', life: 3000 });
        }
        setLoading(false)
    };

    useEffect(() => {
        if (user.jwt) {
            navigate("/report");
        }
        // eslint-disable-next-line 
    }, [user])

    return (
        <>
            <Toast ref={toast} />
            <div className='surface-ground px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center background'>
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                    <div className="text-center mb-5">
                        <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        {/* <span className="text-600 font-medium line-height-3">Don't have an account?</span> */}
                        {/* <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a> */}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                        <InputText
                            type="text"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            className="w-full mb-3" />

                        <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                        <InputText
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            className="w-full mb-3" />

                        <div className="flex align-items-center justify-content-between mb-6">

                        </div>

                        <Button disabled={loading} label="Sign In" icon="pi pi-user" className="w-full" onClick={handleLogin} />
                    </div>
                </div>
            </div>
        </>
    )
}


