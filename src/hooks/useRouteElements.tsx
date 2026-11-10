import {Navigate, Outlet, useRoutes} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductList from "../pages/ProductList";
import Register from "../pages/Register";
import Login from "../pages/Login";
import {useContext} from "react";
import {AppContext} from "../contexts/app.context.tsx";
import Account from "../pages/Account";

function ProtectedRoute() {
    const {isAuthenticated} = useContext(AppContext)
    return isAuthenticated ? <Outlet/> : <Navigate to='/account/login'/>
}

function RejectedRoute() {
    const {isAuthenticated} = useContext(AppContext)
    return !isAuthenticated ? <Outlet/> : <Navigate to='/'/>
}

const useRouteElements = () => {
    return useRoutes([
        {
            path: '',
            element: <RejectedRoute/>,
            children: [
                {
                    path: '',
                    element: <MainLayout/>,
                    children: [
                        // {
                        //     path: "/account/login",
                        //     element: (
                        //         <Login/>
                        //     )
                        // },
                        {
                            path: "/account/register",
                            element: (
                                <Register/>
                            )
                        }
                    ]
                }
            ]
        },
        {
            path: '',
            element: <ProtectedRoute/>,
            children: [
                {
                    path: '',
                    element: <MainLayout/>,
                    children: [
                        {
                            path: "/account",
                            element: (
                                <Account/>
                            )
                        }
                    ]
                }
            ]
        },
        {
            path: '',
            element: <MainLayout/>,
            children: [
                {
                    path: "/",
                    index: true,
                    element: (
                        <ProductList/>
                    )
                },
                {
                    path: "/account",
                    element: (
                        <Account/>
                    )
                },
                {
                    path: "/account/login",
                    element: (
                        <Login/>
                    )
                },
            ]
        }
    ])
}

export default useRouteElements;