import './App.css'
import DynamicIsland from "./Components/DynamicIsland/DynamicIsland.tsx";

function App() {

    return (
        <>
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

            }}>
                <DynamicIsland/>
            </div>
        </>
    )
}

export default App
