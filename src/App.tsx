import useRouteElements from "./hooks/useRouteElements.tsx";

function App() {
    const routeElements = useRouteElements();
  return (
      <>
          {routeElements}
      </>
  )
}

export default App
