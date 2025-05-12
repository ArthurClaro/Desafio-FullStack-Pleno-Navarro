import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect } from 'react';
import { useVehicles } from '../../contexts/VehiclesContext';
import InfiniteScroll from 'react-infinite-scroll-component';

export const VehiclesTable = () => {
    const [page, setPage] = useState(1);
    const [allVehicles, setAllVehicles] = useState<any[]>([]);
    const { vehicles, isLoading, error, refetch, searchTerm } = useVehicles();
    // console.log(vehicles);
    useEffect(() => {
        if (vehicles) {
            setAllVehicles(page === 1 ? vehicles : [...allVehicles, ...vehicles]);
        }
    }, [vehicles, page]);

    const filteredVehicles = allVehicles.filter(vehicle =>
        vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.fleet && vehicle.fleet.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const fetchMoreData = () => {
        setPage(prev => prev + 1);
    };

    useEffect(() => {
        if (page === 1) {
            const scrollDiv = document.getElementById('scrollableDiv');
            scrollDiv?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page]);

    if (isLoading && page === 1) return <div>Carregando...</div>;
    if (error) {
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
        <div id="scrollableDiv" className={`h-[500px] datatable-scroll overflow-auto rounded-[16px] custom-vehicles-table mb-10`}>
            <InfiniteScroll
                dataLength={filteredVehicles.length}
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
                    value={filteredVehicles}
                    tableStyle={{ minWidth: '50rem' }}
                    className={`p-datatable-scrollable-body`}
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