import { useState } from 'react';
import { VehiclesTable } from '../../components/VehiclesTable';
import { Button } from 'primereact/button';
import { RadioButton } from "primereact/radiobutton";
import { MapGoogle } from '../../components/Map';

function Home() {
    const [ingredient, setIngredient] = useState('');

    return (
        <div className="min-h-screen flex flex-col">
            <header className="p-4">
                <h1>Arthur Claro - Dev FullStack</h1>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start p-4 gap-4">
                <div className='flex flex-row'>
                    <p>Lista</p>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton inputId="ingredient1" name="pizza" value="Cheese" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Cheese'} />
                            <label htmlFor="ingredient1" className="ml-2">Cheese</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="ingredient2" name="pizza" value="Mushroom" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Mushroom'} />
                            <label htmlFor="ingredient2" className="ml-2">Mushroom</label>
                        </div>
                    </div>

                    <div>
                        <input type="text" placeholder='Buscar por placa ou frota'/>
                        <button>Novo</button>
                        <Button label="Novo" />
                    </div>
                </div>

                <section className="w-full max-w-7xl border-2 border-red-500">
                    <p>Mapa rastreador</p>
                    <MapGoogle />
                </section>

                <article className="w-full max-w-7xl">
                    <h1 className="text-2xl font-bold mb-4">Lista de Veículos</h1>
                    <div className="h-[600px]">
                        <VehiclesTable />
                    </div>
                </article>

            </main>
        </div>
    )
}

export default Home
