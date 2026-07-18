import { configureStore } from '@reduxjs/toolkit'

import authStateSlice from './authState-slice'

const store = configureStore({
    reducer: {authState: authStateSlice.reducer}
})

export default store