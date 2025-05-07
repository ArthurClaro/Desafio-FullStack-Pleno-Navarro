import { BrowserRouter } from "react-router-dom"
import RoutesHead from "./routes/RoutesHead"

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RoutesHead />
    </BrowserRouter>
  )
}

export default App
