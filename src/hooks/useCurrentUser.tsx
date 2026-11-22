import {useContext} from "react";
import {AppContext} from "../contexts/app.context.tsx";
import {setUserProfile} from "../utils/auth.ts";
import type {User} from "../types/user.type.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {Schema} from "../utils/rules.ts";
import authApi from "../apis/auth.api.ts";
import {purchasesStatus} from "../constants/purchase.ts";

type LoginForm = Pick<Schema, 'email' | 'password'>

const useCurrentUser = () => {
    const queryClient = useQueryClient()
    const {profile, setProfile, setIsAuthenticated, setExtendedPurchases} = useContext(AppContext);

    const handleAfterLogin = (user: User) => {
        handleUpdateProfile(user)
        setIsAuthenticated(true)
    }

    const handleAfterLogout = () => {
        setIsAuthenticated(false)
        setProfile(null)
        setExtendedPurchases([])
    }

    const handleUpdateProfile = (user: User) => {
        setProfile(user)
        setUserProfile(user)
    }

    const loginMutation = useMutation({
        mutationFn: (body: LoginForm) => authApi.login(body),
        onSuccess: (data) => {
            handleAfterLogin(data.data.data.user)
        }
    });

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            handleAfterLogout()
            queryClient.removeQueries({queryKey: ['purchases', {status: purchasesStatus.inCart}]})
        }
    })

    return {profile, loginMutation, logoutMutation, handleUpdateProfile}
}

export default useCurrentUser;