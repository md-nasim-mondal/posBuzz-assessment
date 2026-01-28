import {createBrowserRouter} from "react-router";
import App from "../App";
import HomePage from "../pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        // element: <App />,
        Component: App,
        children: [
            {
                index: true,
                Component: HomePage,
            }
        ]

    },
]);

export default router;