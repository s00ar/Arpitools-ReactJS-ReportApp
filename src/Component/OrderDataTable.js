
import React, { useContext, useEffect, useRef, useState, } from 'react';
import { FilterMatchMode, } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { baseURL } from '../utils';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import '../App.css';

const OrderTable = function OrderDataTable() {
    const { user } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [sellersTotal, setSellersTotal] = useState(null);
    const [detail, setDetail] = useState(null);
    const [loaidng, setLoaing] = useState(false);
    const [query, setQuery] = useState({
        startingRange: 0,
        endingRange: 0
    });
    const [first, setFirst] = useState(0);
    const toast = useRef()

    const fetchData = async (page = 1) => {
        if (user.jwt) {
            const { data } = await axios.get(`${baseURL}/api/orders?populate=*&pagination[page]=${page}&pagination[pageSize]=10`, {
                headers: {
                    'Authorization': 'Bearer ' + user.jwt
                }
            });
            setCustomers(data ?? { data: [], meta: {} })
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line 
    }, [])
    const [filters1, setFilters1] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const handleQuerySearch = async () => {
        setSellersTotal(null)
        let url = `${baseURL}/api/orders?populate=*`
        console.log({ query })
        if (query.startingRange !== '') url += `&filters[id][$gte][0]=${query.startingRange}`
        if (query.endingRange !== '') url += `&filters[id][$lte][1]=${query.endingRange}`
        // if (query.startingRange >= query.endingRange) {
        //     toast.current.show({ severity: 'error', summary: 'Invalid Range', detail: 'Ending range should be greater than starting range' });
        //     return
        // }
        setLoaing(true)
        if (user.jwt) {
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + user.jwt
                }
            });
            setCustomers(data ?? { data: [], meta: {} })
            setSellersTotal(data.sellers_amount)
        }
        setLoaing(false)
    }

    const renderHeader = () => {
        return (
            <span>
                <InputText type="number" value={query.startingRange} onChange={(e) => setQuery({ ...query, startingRange: e.target.value })} placeholder="Rango de inicio" style={{ marginLeft: 5 }} />
                <InputText type="number" value={query.endingRange} onChange={(e) => setQuery({ ...query, endingRange: e.target.value })} placeholder="Rango final" style={{ marginLeft: 5 }} />
                <Button label="Búsqueda" onClick={handleQuerySearch} style={{ marginLeft: 5 }} />
            </span>
        );
    }


    const handleDetail = (row) => {
        // setDetail(row.attributes?.productlist ? JSON.parse(row.attributes?.productlist) : [])

        // console.log("row.attributes?.products.data content",row.attributes?.products.data)
        // console.log("details content",detail)
        // setDetail(row.attributes?.products.data)
        let validJson = {}
        try {
            let _ = JSON.parse(row.attributes?.productlist)
            for (let each of _) {
                validJson[each?.product?.id || ''] = each.quantity
            }
        } catch (error) {
            validJson = {}
        }
        if (row?.attributes?.products?.data) {
            let payload = [];
            row.attributes?.products?.data?.map((item) => {
                var object = {
                    id: item.id
                };
                object["id"] = item?.id;
                object["productname"] = item?.attributes?.name;
                object["amount1"] = item?.attributes?.price1;
                object["amount2"] = item?.attributes?.price2;
                object["quantity"] = validJson[item?.id] || 0;
                object["unit"] = item?.attributes?.unit;
                payload.push(object);
            })
            setDetail(payload);
        }
    }
    const header1 = renderHeader('filters1');

    const onPage = async (event) => {
        setLoaing(true);
        const startIndex = event.first;
        setFirst(startIndex);
        await fetchData(event.page + 1)
        setLoaing(false);
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className="card ">
                <div className='row'>
                    <div className='rowfirst'>
                        <h5>Órdenes de compra</h5>
                    </div>
                    <div className='rowlast'>
                        <img className='logo' src={require('../assets/logo192.png')} />
                    </div>
                </div>
                <DataTable
                    totalRecords={customers?.meta?.pagination?.total || 0}
                    lazy onPage={onPage}
                    first={first}
                    value={customers.data}
                    loading={loaidng}
                    paginator rows={10} header={header1} filters={filters1} onFilter={(e) => setFilters1(e.filters)}
                    dataKey="id" responsiveLayout="scroll"
                    stateStorage="session" stateKey="dt-state-demo-session" emptyMessage="No se encontraron órdenes.">
                    <Column field="id" header="Id" ></Column>
                    <Column header="Fecha" body={(row) => (<p>{row.attributes.createdAt.slice(0, 10)}</p>)}></Column>
                    <Column header="Hora" body={(row) => (<p>{row.attributes.createdAt.slice(11, 19)}</p>)}></Column>
                    <Column header="Comprador" body={(row) => (<p>{row.attributes.buyer}</p>)} ></Column>
                    <Column header="Teléfono" body={(row) => (<p>{row.attributes.buyerphone}</p>)} ></Column>
                    <Column header="Email" body={(row) => (<p>{row.attributes.buyeremail}</p>)} ></Column>
                    <Column header="Monto" body={(row) => (<p>${row.attributes.amount}</p>)} ></Column>
                    <Column header="Recibo" body={(row) => (
                        <a href={'https://strapi.arpitools.com' + row.attributes.receipt} target="_blank">
                            <img className='recibo' src={'https://strapi.arpitools.com' + row.attributes.receipt} />
                        </a>)} ></Column>
                    <Column header="Entrega" body={(row) => (<p>{row.attributes.deliveryto}</p>)} ></Column>
                    <Column header="Vendedor" body={(row) => (<p>{row.attributes.seller?.data?.attributes?.name}</p>)} ></Column>
                    <Column header="Detalles" body={(row) => (
                        // eslint-disable-next-line
                        <a href="#" onClick={() => handleDetail(row)}>Ver detalle</a>
                    )}></Column>
                </DataTable>
                <br />
                <hr />
                {sellersTotal && (
                    <>
                        <h5>Monto total del vendedor</h5>
                        <DataTable value={sellersTotal}
                            loading={loaidng}
                            paginator rows={10} filters={filters1} onFilter={(e) => setFilters1(e.filters)}
                            dataKey="id" responsiveLayout="scroll"
                            stateStorage="session" stateKey="dt-state-demo-session" emptyMessage="No se encontraron órdenes.">
                            <Column field="seller_id" header="Id" ></Column>
                            <Column field="name" header="Nombre" ></Column>
                            <Column field="sum(amount)" header="Total" ></Column>
                        </DataTable>
                    </>
                )}
            </div>

            <Dialog visible={detail !== null} onHide={() => setDetail(null)} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }}>
                <DataTable value={detail}
                    paginator rows={10} filters={filters1} onFilter={(e) => setFilters1(e.filters)}
                    dataKey="id" responsiveLayout="scroll"
                    stateStorage="session" stateKey="dt-state-demo-session" emptyMessage="No product found.">
                    <Column field="id" header="Código del producto" ></Column>
                    <Column field="productname" header="Nombre del producto" ></Column>
                    <Column field="amount1" header="Precio unitario Ferreteros" ></Column>
                    <Column field="amount2" header="Precio unitario Constructores" ></Column>
                    <Column field="quantity" header="Cantidad" ></Column>
                    <Column field="unit" header="Unidad" ></Column>

                </DataTable>
            </Dialog>
        </div>
    );
}

export default React.memo(OrderTable);
