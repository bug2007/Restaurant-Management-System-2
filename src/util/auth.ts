import { redirect } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import store from "../store/index";
import { authStateActions } from "../store/authState-slice";
// import { getAuthProfile } from "./http";

type TokenExp = {
  exp: number;
};

export function tokenExpired(token: string) {
    const { exp } = jwtDecode<TokenExp>(token)
    return exp*1000 <= Date.now()
}

function logOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenExpiryTime");
    localStorage.removeItem("userInfo");
    store.dispatch(authStateActions.logAdminOut());
}

export async function checkAuthLoader() {
    const token = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const refreshTokenExpiryTime = localStorage.getItem('refreshTokenExpiryTime')
    if (!token || !refreshToken || !refreshTokenExpiryTime) {
        logOut()
        return redirect('/login')
    }
    if (!tokenExpired(token)) {
        return null
    }

    if (new Date(refreshTokenExpiryTime).getTime() <= Date.now()) {
        logOut()
        return redirect('/login')
    }
    const response = await fetch('https://bssrms.runasp.net/api/Auth/refreshToken', {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refreshToken
        })
    })

    if (!response.ok) {
        logOut()
        return redirect('/login')
    }
    const result = await response.json()
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("refreshToken", result.refreshToken);
    localStorage.setItem("refreshTokenExpiryTime", result.refreshTokenExpiryTime);
    
    return null  // no need to return redirect('/dasboard') since loader is attached to this route anyway
}