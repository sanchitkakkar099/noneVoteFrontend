import { lazy } from "react";
const Dashboard = lazy(() => import("../components/dashboard/Dashboard"));
const LoginSingnupComponent = lazy(() => import("../components/auth/LoginSingup"));


export const privateRoutes = [
    { path: "/", Component: Dashboard},
]

export const publicRoutes = [
    { path: "/login", Component: LoginSingnupComponent},

]