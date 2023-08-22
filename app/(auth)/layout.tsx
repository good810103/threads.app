import "../globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Montserrat } from "next/font/google";

export const metadata = {
    title: "Threads",
    description: "A Next.js 13 Meta Threads Application",
};

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }){
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${montserrat.className} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}