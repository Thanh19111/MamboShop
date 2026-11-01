import useRouteElements from "./hooks/useRouteElements.tsx";
import {ToastContainer} from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
    const routeElements = useRouteElements();
    return (
        <ErrorBoundary>
            {routeElements}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </ErrorBoundary>
    )
}

export default App
