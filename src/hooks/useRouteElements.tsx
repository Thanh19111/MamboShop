import {useRoutes} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const useRouteElements = () => {
    return useRoutes([
        {
            index: true,
            element:
                <MainLayout>
                    <div>Test</div>
                </MainLayout>
        }
    ])
}

export default useRouteElements;