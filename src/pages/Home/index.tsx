import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Button } from 'primereact/button';


import { RadioButton } from 'primereact/radiobutton';
import { VehiclesTable } from '../../components/VehiclesTable';


const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -23.55052,  // exemplo: São Paulo
    lng: -46.633308
};

function Home() {

    return (

        <>
            <header>
                <h1>Arthur Claro</h1>
            </header>

            <main className="flex flex-col items-center justify-center ">

                <div>
                    <p>Lista</p>
                    {/* Toogles */}
                    {/* <div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="ingredient1" name="pizza" value="Cheese" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Cheese'} />
                            <label htmlFor="ingredient1" className="ml-2">Cheese</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="ingredient2" name="pizza" value="Mushroom" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Mushroom'} />
                            <label htmlFor="ingredient2" className="ml-2">Mushroom</label>
                        </div>
                    </div> */}

                    <div>
                        <input type="text" />
                        <button>Novo</button>

                        <Button label="Novo" />
                    </div>

                </div>

                <section className="border-2 border-red-500">
                    <p>Mapa rastreador</p>
                    {/* Mapa */}
                    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={13}
                        >
                            <Marker position={center} />
                        </GoogleMap>
                    </LoadScript>

                </section>

                <article>
                    {/* primereact a cada 20 scroll */}
                    <h1 className="text-2xl font-bold mb-4">Lista de Veículos</h1>
                    <VehiclesTable />

                </article>

            </main>
        </>
    )
}
export default Home
