import { useQuery } from '@tanstack/react-query';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { getVehicles } from '../../services/api';

export const VehiclesTable = () => {
    const [page, setPage] = useState(1);
    const [type, setType] = useState('tracked');

  
    const {
        data,
        isLoading,
        error,
        isError,
        refetch
    } = useQuery({
    
        queryKey: ['vehicles', type, page],

        queryFn: () => getVehicles({ type, page })
    });

    console.log('Estado da requisição:', {
        isLoading,
        isError,
        error,
        currentPage: page,
        currentType: type
    });

    console.log('Dados recebidos:', data);

    if (isLoading) {
        console.log('Carregando dados...');
        return <div>Carregando...</div>;
    }

    if (error) {
        console.error('Erro na requisição:', error);
        return <div>Erro ao carregar dados</div>;
    }

    const vehicles = data?.content?.vehicles || [];
    const totalRecords = data?.content?.totalPages ? data.content.totalPages * 10 : 0;

    const handlePageChange = (e: DataTablePageEvent) => {
        if (typeof e.page === 'number') {
            console.log('Mudando para página:', e.page + 1);
            setPage(e.page + 1);
        }
    };

    return (
        <div className="card">
            <DataTable
                value={vehicles}
                paginator
                rows={10}
                totalRecords={totalRecords}
                onPage={handlePageChange}
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column field="plate" header="Placa"></Column>
                <Column field="model" header="Modelo"></Column>
                <Column field="type" header="Tipo"></Column>
                <Column field="nameOwner" header="Proprietário"></Column>
                <Column field="status" header="Status"></Column>
            </DataTable>
        </div>
    );
};