import { usePage } from "@inertiajs/react"
import Footer from "../components/Footer"

export default function Layout({ children }) {
    const { url } = usePage()
    const isBare = url.startsWith("/admin") || url.startsWith("/portal")

    if (isBare) {
        return <>{children}</>
    }

    return (
        <div className="font-sans text-gray-900 bg-white selection:bg-primary selection:text-dark-bg">
            <main className="overflow-x-hidden">{children}</main>
            <Footer />
        </div>
    )
}
