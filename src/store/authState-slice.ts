import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    fullName: string,
    email: string,
    image: string | null,
    userName: string,
    phoneNumber: string
}

interface AuthState {
    isLogged: boolean,
    userInfo: UserInfo | null
}

const token = localStorage.getItem('accessToken')
const userInfo = localStorage.getItem('userInfo')

const initialState: AuthState = {
    isLogged: !!token,
    userInfo:  userInfo ? JSON.parse(userInfo) : null
}

const authStateSlice = createSlice({
    name: 'authState',
    initialState,
    reducers: {
        logAdminIn(state, action: PayloadAction<UserInfo>) {
            state.isLogged = true
            state.userInfo = action.payload
        },
        logAdminOut(state) {
            state.isLogged = false
            state.userInfo = null
        }
    }
})

export const authStateActions = authStateSlice.actions

export default authStateSlice