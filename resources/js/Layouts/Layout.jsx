import { HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer"

export default function Layout({ children }) {
    return (
        <HelmetProvider>
            <div className="font-sans  text-gray-900 bg-white selection:bg-primary selection:text-dark-bg">
                <main>{children}</main>
                <Footer />
            </div>
        </HelmetProvider>
    );
}
