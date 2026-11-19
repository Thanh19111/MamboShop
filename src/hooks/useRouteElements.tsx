import {Navigate, Outlet, useRoutes} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductList from "../pages/ProductList";
import Register from "../pages/Register";
import Login from "../pages/Login";
import {useContext} from "react";
import {AppContext} from "../contexts/app.context.tsx";
import Account from "../pages/Account";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import HistoryPurchase from "../pages/HistoryPurchase/HistoryPurchase.tsx";
import ChangePassword from "../pages/ChangePassword/ChangePassword.tsx";

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
                        {
                            path: "/account/login",
                            element: (
                                <Login/>
                            )
                        },
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
                        },
                        {
                            path: "/user/profile",
                            element: (
                                <Account/>
                            )
                        },
                        {
                            path: "/user/purchase",
                            element: (
                                <HistoryPurchase/>
                            )
                        },
                        {
                            path: "/user/password",
                            element: (
                                <ChangePassword/>
                            )
                        },
                        {
                            path: "/cart",
                            element: (
                                <Cart/>
                            )
                        },
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
                    path: "/products",
                    element: (
                        <Product/>
                    )
                },
                {
                    path: "/products/:name",
                    element: (
                        <ProductDetail/>
                    )
                }
            ]
        }
    ])
}

export default useRouteElements;