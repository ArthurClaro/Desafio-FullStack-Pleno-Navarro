import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useVehicles } from '../../contexts/VehiclesContext';

const containerStyle = {
    width: '100%',
    height: '512px',
    borderRadius: '16px'
};

const center = {
    lat: -23.550520,
    lng: -46.633308
};

// Função para criar o ícone do caminhão
const createTruckIcon = () => {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);"><path d="M19.15 8a2 2 0 0 0-1.72-1H15V5a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 1 1.73 3.49 3.49 0 0 0 7 .27h3.1a3.48 3.48 0 0 0 6.9 0 2 2 0 0 0 2-2v-3a1.07 1.07 0 0 0-.14-.52zM15 9h2.43l1.8 3H15zM6.5 19A1.5 1.5 0 1 1 8 17.5 1.5 1.5 0 0 1 6.5 19zm10 0a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z"></path></svg>`;
};

interface VehicleLocation {
    lat: number;
    lng: number;
    plate: string;
    name: string;
    ignition: string;
    fleet: string;
    equipmentId: string;
    createdAt: string;
}

export const MapGoogle = () => {
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const { locationVehicles, isLoading, error, searchTerm, refetch } = useVehicles();
    console.log('Dados atualizados:', locationVehicles);

    useEffect(() => {
        refetch();

        const intervalId = setInterval(() => {
            refetch();
        }, 120000);

        return () => {
            clearInterval(intervalId);
        };
    }, [refetch]);

    const onMapLoad = useCallback(() => {
        setIsMapReady(true);
    }, []);

    const handleMarkerClick = useCallback((vehicle: VehicleLocation) => {
        setSelectedVehicle(vehicle);
    }, []);

    const handleInfoWindowClose = useCallback(() => {
        setSelectedVehicle(null);
    }, []);

    const filteredVehicles = useMemo(() => {
        // Primeiro, vamos agrupar os veículos por placa e pegar o mais recente de cada um
        const uniqueVehicles = locationVehicles.reduce((acc: VehicleLocation[], vehicle: VehicleLocation) => {
            const existingVehicle = acc.find((v: VehicleLocation) => v.plate === vehicle.plate);
            if (!existingVehicle || new Date(vehicle.createdAt) > new Date(existingVehicle.createdAt)) {
                return [...acc.filter((v: VehicleLocation) => v.plate !== vehicle.plate), vehicle];
            }
            return acc;
        }, []);

        // Depois, aplicamos o filtro de busca
        return uniqueVehicles.filter((vehicle: VehicleLocation) =>
            vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (vehicle.fleet && vehicle.fleet.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [locationVehicles, searchTerm]);

    const markers = useMemo(() => {
        if (!isMapReady || !filteredVehicles.length) return null;

        return filteredVehicles.map((vehicle: VehicleLocation, index: number) => (
            <Marker
                key={`${vehicle.plate}-${vehicle.equipmentId}-${index}`}
                position={{
                    lat: vehicle.lat,
                    lng: vehicle.lng
                }}
                title={`${vehicle.plate} - ${vehicle.name}`}
                onClick={() => handleMarkerClick(vehicle)}
                zIndex={selectedVehicle?.plate === vehicle.plate ? 1 : 0}
                icon={{
                    url: createTruckIcon(),
                    scaledSize: new window.google.maps.Size(30, 30),
                }}
            />
        ));
    }, [isMapReady, filteredVehicles, handleMarkerClick, selectedVehicle]);

    const infoWindow = useMemo(() => {
        if (!selectedVehicle) return null;

        return (
            <InfoWindow
                position={{
                    lat: selectedVehicle.lat,
                    lng: selectedVehicle.lng
                }}
                onCloseClick={handleInfoWindowClose}
                options={{
                    pixelOffset: new window.google.maps.Size(0, -30)
                }}
            >
                <div style={{ padding: '8px' }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>Informações do Veículo</h3>
                    <p style={{ margin: '4px 0' }}><strong>Placa:</strong> {selectedVehicle.plate}</p>
                    <p style={{ margin: '4px 0' }}><strong>Nome:</strong> {selectedVehicle.name}</p>
                    <p style={{ margin: '4px 0' }}><strong>Frota:</strong> {selectedVehicle.fleet}</p>
                    <p style={{ margin: '4px 0' }}><strong>Equipamento:</strong> {selectedVehicle.equipmentId}</p>
                    <p style={{ margin: '4px 0' }}><strong>Ignição:</strong> {selectedVehicle.ignition}</p>
                    <p style={{ margin: '4px 0' }}>
                        <a
                            href={`https://www.google.com/maps?q=${selectedVehicle.lat},${selectedVehicle.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1a73e8', textDecoration: 'none' }}
                        >
                            Ver no Google Maps
                        </a>
                    </p>
                </div>
            </InfoWindow>
        );
    }, [selectedVehicle, handleInfoWindowClose]);

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={8}
                onLoad={onMapLoad}
            >
                {markers}
                {infoWindow}
                {isLoading && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '10px' }}>Carregando veículos...</div>}
            </GoogleMap>
        </LoadScript>
    );
};