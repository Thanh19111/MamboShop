import {useRoutes} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductList from "../pages/ProductList";

const useRouteElements = () => {
    return useRoutes([
        {
            index: true,
            element:
                <MainLayout>
                    <ProductList/>
                </MainLayout>
        }
    ])
}

export default useRouteElements;