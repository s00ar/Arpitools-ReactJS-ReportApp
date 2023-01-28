import React, { useContext, useEffect } from 'react';
import OrderDataTable from '../Component/OrderDataTable';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import SellerDataTable from '../Component/SellerDataTable';
import UserDataTable from '../Component/UserDataTable';

export default function Home() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.jwt) {
            navigate("/login");
        }
        // eslint-disable-next-line 
    }, [user])

    return (
        <>
            <>
                <div className="layout-topbar">
                    <span>Gestión de ordenes de compra - Arpitools</span>
                    <ul className={"layout-topbar-menu lg:flex origin-top layout-topbar-menu-mobile-active"}>
                        <li>
                            <button onClick={() => logout()} className="p-link layout-topbar-button " >
                                <i className="pi pi-user-minus bttn-salir" />
                                <p className='bttn-salir'>Salir</p>
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="layout-main-container">
                    <div className="layout-main">
                        <div className="grid">
                            <div className="col-12">
                                <OrderDataTable />
                            </div>
                            <div className="col-12">
                                <SellerDataTable />
                            </div>
                            <div className="col-12">
                                <UserDataTable />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}