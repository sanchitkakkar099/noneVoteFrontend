import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const initState = {
    session: cookies?.get('non_vote')
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initState,
    reducers: {
        setSession: (state, { payload }) => {
            state.session = payload;
        },
        getSession: (state, { payload }) => {
            state.session = payload;
        },
    },
});
export const {
    setSession,
    getSession
} = authSlice.actions;

export default authSlice.reducer;