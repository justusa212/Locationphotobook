import { FunctionComponent, ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";

interface IProps {
    main: ReactNode;
}

const Layout: FunctionComponent<IProps> = ({ main }) => {
    const {logout, authenticated} = useAuth()

    return (
    <div className="bg-gray-900 text-white max-w-screen-2xl mx-auto">
        <nav className="bg-gray-800" style={{height: "64px"}}>
            <div className="px-6 flex items-center justify-between h-16">
                <Link href="/" >
                    <a >
                        <img src="/logo.png" alt="logo" className="inline w-6" />
                    </a>
                </Link>
                {authenticated ? (
                <>
                    <Link href="/snapshots/add" >
                        <a >Add SnapShot</a>
                    </Link>
                    <button onClick={logout}>Logout</button>
                </>
                ):(
                    <Link href="/auth">
                        <a>Login/Signup</a>
                    </Link>
                )}
                </div>
            </nav>
        <main style={{minHeight: "calc(100vh - 64px)"}}>{main}</main>
    </div>
    );
}

export default Layout;