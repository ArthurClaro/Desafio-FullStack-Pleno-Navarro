import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect } from 'react';
import { getVehicles } from '../../services/api';
import InfiniteScroll from 'react-infinite-scroll-component';

export const VehiclesTable = () => {
    const [page, setPage] = useState(1);
    const [type, setType] = useState('tracked');
    const [allVehicles, setAllVehicles] = useState<any[]>([]);

    const {
        data,
        isLoading,
        error: queryError,
        isError,
        refetch
    } = useQuery({
        queryKey: ['vehicles', type, page],
        queryFn: () => getVehicles({ type, page, perPage: 20 }),
        retry: 1,
        retryDelay: 1000,
    });
    console.log(data, 'reposta api tb')

    useEffect(() => {
        if (data?.content?.vehicles) {
            setAllVehicles(page === 1 ? data.content.vehicles : [...allVehicles, ...data.content.vehicles]);
        }
    }, [data, page]);

    const fetchMoreData = () => {
        if (data?.content?.totalPages && page >= data.content.totalPages) {
            setPage(1);
            setAllVehicles([]);
            return;
        }
        setPage(prev => prev + 1);
    };

    useEffect(() => {
        if (page === 1) {
            const scrollDiv = document.getElementById('scrollableDiv');
            scrollDiv?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page]);

    if (isLoading && page === 1) return <div>Carregando...</div>;
    if (isError || queryError) {
        return (
            <div>
                <div>Erro ao carregar dados</div>
                <button onClick={() => {
                    setPage(1);
                    setAllVehicles([]);
                    refetch();
                }}>
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div id="scrollableDiv" style={{ height: '500px', overflow: 'auto' }}>
            <InfiniteScroll
                dataLength={allVehicles.length}
                next={fetchMoreData}
                hasMore={true}
                loader={<div style={{ textAlign: 'center', padding: '10px' }}>Carregando mais veículos...</div>}
                scrollableTarget="scrollableDiv"
                endMessage={
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        <b>Reiniciando lista...</b>
                    </div>
                }
            >
                <DataTable
                    value={allVehicles}
                    tableStyle={{ minWidth: '50rem' }}
                    className="p-datatable-scrollable-body"
                >
                    <Column field="plate" header="Placa"></Column>
                    <Column field="model" header="Modelo"></Column>
                    <Column field="type" header="Tipo"></Column>
                    <Column field="nameOwner" header="Proprietário"></Column>
                    <Column field="status" header="Status"></Column>
                </DataTable>
            </InfiniteScroll>
        </div>
    );
};