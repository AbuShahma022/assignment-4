import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { userRoute } from "../modules/user/user.route";
import { categoryRoute } from "../modules/category/category.route";
import { MasterServiceRoute } from "../modules/MasterService/MasterService.route";
import { technicianProfileRoute } from "../modules/technicianProfile/technicianProfile.route";

interface IRoute {
    path: string;
    route: Router;
}
const router = Router()

const allRoutes : IRoute[] = [
    {
        path: "/auth",
        route: authRoute
    },
    {
        path: "/user",
        route: userRoute
    },
    {
        path:"/category",
        route: categoryRoute
    },
    {
        path:"/master-service",
        route: MasterServiceRoute
    },
    {
        path:"/technician-profile",
        route: technicianProfileRoute
    }
]

allRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});
export default router;