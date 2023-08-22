import '../globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { Montserrat } from 'next/font/google';

import Topbar from '@/components/shared/Topbar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import Bottombar from '@/components/shared/Bottombar';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
  title: "Threads",
  description: "https://www.youtube.com/watch?v=O5cmLDVTgAs&list=WL&index=8&t=1061s",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={montserrat.className}>
          <Topbar />
          
          <main className='flex flex-row'>
            <LeftSidebar />

            <section className='main-container'>
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>

            <RightSidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}
