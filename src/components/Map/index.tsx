import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { getVehicles } from '../../services/api';
import { useState, useCallback, useMemo } from 'react';

const containerStyle = {
    width: '80vw',
    height: '600px'
};

const center = {
    lat: -23.550520,
    lng: -46.633308
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
    const [mapVehicles, setMapVehicles] = useState<VehicleLocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    const fetchVehicles = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // console.log('Iniciando busca de veículos...');
            const response = await getVehicles({ type: 'tracked', page: 1 });
            console.log('Resposta da API:', response);
            
            if (response.content.locationVehicles) {
                const uniqueVehicles = response.content.locationVehicles.reduce((acc, vehicle) => {
                    // está reduzindo objetos com IDs repetidos 
                    const existingVehicle = acc.find(v => v.plate === vehicle.plate);
                    if (!existingVehicle || new Date(vehicle.createdAt) > new Date(existingVehicle.createdAt)) {
                        return [...acc.filter(v => v.plate !== vehicle.plate), vehicle];
                    }
                    return acc;
                }, [] as VehicleLocation[]);

                // console.log('Veículos processados:', uniqueVehicles);
                setMapVehicles(uniqueVehicles);
            }
        } catch (err) {
            console.error('Erro detalhado:', err);
            setError('Erro ao carregar os veículos');
        } finally {
            setIsLoading(false);
        }
    };

    const onMapLoad = useCallback(() => {
        // console.log('Mapa carregado, buscando veículos...');
        setIsMapReady(true);
        fetchVehicles();
    }, []);

    const handleMarkerClick = useCallback((vehicle: VehicleLocation) => {
        // console.log('Marcador clicado:', vehicle.plate);
        setSelectedVehicle(vehicle);
    }, []);

    const handleInfoWindowClose = useCallback(() => {
        // console.log('Fechando InfoWindow');
        setSelectedVehicle(null);
    }, []);

    const markers = useMemo(() => {
        if (!isMapReady || !mapVehicles.length) return null;

        return mapVehicles.map((vehicle) => (
            <Marker
                key={vehicle.plate}
                position={{
                    lat: vehicle.lat,
                    lng: vehicle.lng
                }}
                title={`${vehicle.plate} - ${vehicle.name}`}
                onClick={() => handleMarkerClick(vehicle)}
                zIndex={selectedVehicle?.plate === vehicle.plate ? 1 : 0}
            />
        ));
    }, [isMapReady, mapVehicles, handleMarkerClick, selectedVehicle]);

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
                </div>
            </InfoWindow>
        );
    }, [selectedVehicle, handleInfoWindowClose]);

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onMapLoad}
            >
                {markers}
                {infoWindow}
                {isLoading && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '10px' }}>Carregando veículos...</div>}
            </GoogleMap>
        </LoadScript>
    );
};