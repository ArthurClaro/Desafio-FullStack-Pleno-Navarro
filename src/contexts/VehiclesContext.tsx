import { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '../services/api';

interface VehiclesContextData {
    type: string;
    setType: (type: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    vehicles: any[];
    locationVehicles: any[];
    isLoading: boolean;
    error: any;
    refetch: () => void;
}

const VehiclesContext = createContext<VehiclesContextData>({} as VehiclesContextData);

export function VehiclesProvider({ children }: { children: ReactNode }) {
    const [type, setType] = useState('tracked');
    const [searchTerm, setSearchTerm] = useState('');

    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['vehicles', type],
        queryFn: () => getVehicles({ type, page: 1, perPage: 20 }),
        retry: 1,
        retryDelay: 1000,
    });

    const vehicles = data?.content?.vehicles || [];
    const locationVehicles = data?.content?.locationVehicles || [];

    return (
        <VehiclesContext.Provider value={{
            type,
            setType,
            searchTerm,
            setSearchTerm,
            vehicles,
            locationVehicles,
            isLoading,
            error,
            refetch
        }}>
            {children}
        </VehiclesContext.Provider>
    );
}

export function useVehicles() {
    const context = useContext(VehiclesContext);
    if (!context) {
        throw new Error('useVehicles must be used within a VehiclesProvider');
    }
    return context;
} 