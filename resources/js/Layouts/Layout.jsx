import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Layout({ children }) {
    return (
        <div className="font-sans antialiased text-gray-900 bg-white selection:bg-primary selection:text-dark-bg">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
