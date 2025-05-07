import axios from "axios";

interface Vehicle {
    id: string;
    plate: string;
    fleet: string | null;
    type: string;
    model: string;
    nameOwner: string;
    status: string;
    createdAt: string;
}

interface LocationVehicle {
    id: string;
    fleet: string;
    equipmentId: string;
    name: string;
    plate: string;
    ignition: string;
    lat: number;
    lng: number;
    createdAt: string;
}

interface ApiResponse {
    statusCode: number;
    message: string;
    content: {
        vehicles: Vehicle[];
        locationVehicles?: LocationVehicle[];
        totalPages: number;
        page: number;
        perPage: number;
    };
}

interface GetVehiclesParams {
    type?: string;
    page?: number;
}

const api = axios.create({
    baseURL: "https://develop-back-rota.rota361.com.br/recruitment",
    timeout: 10 * 1000,
    headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
    }
});

export const getVehicles = async ({ type = 'tracked', page = 1 }: GetVehiclesParams): Promise<ApiResponse> => {
    const response = await api.get<ApiResponse>(`/vehicles/list-with-paginate?type=${type}&page=${page}`);
    return response.data;
};

export default api; 