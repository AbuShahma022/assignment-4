import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { userRoute } from "../modules/user/user.route";
import { categoryRoute } from "../modules/category/category.route";

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
    }
]

allRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});
export default router;