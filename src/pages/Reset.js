import React, { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { baseURL } from '../utils';

export default function Reset() {
    const [searchParams] = useSearchParams();
    const [code, setCode] = useState(searchParams.get('code'));
    const [newPassword, setNewPassword] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef(null);
    const [loading, setLoading] = useState(false)

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (newPassword !== password) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Password not matched', life: 3000 });
                setLoading(false)
                return
            }
            if (password.length < 6) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Password length should be atleast 6', life: 3000 });
                setLoading(false)
                return
            }
            const { data } = await axios.post(baseURL + '/api/auth/reset-password', {
                code,
                password: password,
                passwordConfirmation: newPassword
            })
            setNewPassword('')
            setPassword('')
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password changed successfully.', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error, please tray again later', life: 3000 });
        }
        setLoading(false)
    };

    return (
        <>
            <Toast ref={toast} />
            {code && (
                <div className='surface-ground px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center background'>
                    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Reset Password</div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-900 font-medium mb-2">New Password</label>
                            <InputText
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                className="w-full mb-3" />

                            <label htmlFor="password" className="block text-900 font-medium mb-2">Confirm Password</label>
                            <InputText
                                type="password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                }}
                                className="w-full mb-3" />

                            <div className="flex align-items-center justify-content-between mb-6">

                            </div>

                            <Button disabled={loading} label="Reset Password" icon="pi pi-user" className="w-full" onClick={handleReset} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
