import { VehiclesProvider } from '../../contexts/VehiclesContext';
import { VehiclesTable } from '../../components/VehiclesTable';
import { MapGoogle } from '../../components/Map';
import { useVehicles } from '../../contexts/VehiclesContext';

function HomeContent() {
    const { type, setType, searchTerm, setSearchTerm } = useVehicles();

    return (
        <>
            <header className='bg-[#001E2E]'>
                <h1 className='px-[26px] py-[16px] text-[#fff] text-[18px] font-medium'>Arthur Claro - Dev FullStack</h1>
            </header>

            <main className="  main-scroll mt-[15px]  overflow-scroll flex flex-col px-[36px] py-[0] gap-[24px]">

                <nav className="flex mt-[4px] pb-[20px] flex-row content-center justify-between items-center h-[80px] border-b border-[#002D44]">
                    <div className="flex flex-row items-center gap-[5vw]">
                        <p className='text-[16px] text-[#fff] font-semibold'>Lista</p>
                        <div className='flex flex-row gap-3'>
                            <div className="flex align-items-center items-center">
                                <input
                                    type="radio"
                                    id="tracked"
                                    name="type"
                                    value="tracked"
                                    onChange={(e) => setType(e.target.value)}
                                    checked={type === 'tracked'}
                                    className='custom-radio'
                                />
                                <label htmlFor="tracked" className="text tracking-[0.5px] ml-2 text-[12px] text-[#fff] font-medium">Rastreados</label>
                            </div>
                            <div className="flex align-items-center items-center">
                                <input
                                    type="radio"
                                    id="others"
                                    name="type"
                                    value="others"
                                    onChange={(e) => setType(e.target.value)}
                                    checked={type === 'others'}
                                    className='custom-radio'
                                />
                                <label htmlFor="others" className="text tracking-[0.5px] ml-2 text-[12px] text-[#fff] font-medium">Outros</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row p-input-icon-left gap-[3vw]">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por placa ou frota"
                            className="p-[10px] w-[279px] text text-[12px] text-[#fff] border border-solid border-[#89919B] rounded-[8px] "
                        />
                        <button className='w-[149px] p-[10px] bg-[#0095E4] text-[#fff] rounded-[8px]'>Novo</button>
                    </div>

                </nav>

                <section className="px-[21px] py-[16px] flex flex-col gap-2 bg-[#001622] border border-[#002D44] rounded-[16px]">
                    <h3 className='text-[16px] text-[#fff] font-semibold'>Mapa rastreador</h3>
                    <MapGoogle />
                </section>

                <article className="">
                    <VehiclesTable />
                </article>

                {/* Modal */}
            </main>
        </>
    );
}

export default function Home() {
    return (
        <VehiclesProvider>
            <HomeContent />
        </VehiclesProvider>
    );
}
