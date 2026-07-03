import Footer from "../components/Footer"

export default function Layout({ children }) {
    return (
        <div className="font-sans text-gray-900 bg-white selection:bg-primary selection:text-dark-bg">
            <main className="overflow-x-hidden">{children}</main>
            <Footer />
        </div>
    );
}
