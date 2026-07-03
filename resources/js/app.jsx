import { createInertiaApp } from "@inertiajs/react";
import { hydrateRoot } from "react-dom/client";
import Layout from "./Layouts/Layout";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    setup({ el, App, props }) {
        if (el) {
            hydrateRoot(el, <App {...props} />);
        }
        return <App {...props} />;
    },
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: "#4B5563",
    },
    layout: () => Layout,
});
