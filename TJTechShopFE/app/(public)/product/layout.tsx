"use server"

import Navbar from "../navbar";
import { getTokenClaims } from "../../api/jwt-token";
import { redirect } from "next/navigation";

async function ProductLayout({
    children
}: {
    children: React.ReactNode
}) {
    await getTokenClaims().then((result) => {
        if (!result) {
            redirect('/login');
        }
    })

    return (
        <>



            <div className=" xl:px-44 sticky top-0 overflow-x-clip">
                <Navbar />
            </div>
            <main className="sm:flex sm:flex-col items-center min-h-screen overflow-hidden">
                    {children}
            </main>
        </>

    );
}

export default ProductLayout;