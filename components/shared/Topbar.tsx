import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OrganizationSwitcher, SignOutButton, SignedIn, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const Topbar = () => {
    const isUserLoggedIn = true;

    return (
        <nav className='topbar'>
            <Link href='/' className='flex items-center gap-4'>
                <Image src='/logo.svg' alt='Logo' width={28} height={28} />

                <p className='text-heading3-bold text-light-1 max-xs:hidden'>Threads</p>
            </Link>

            <div className='flex items-center gap-1'>
                <div className='block md:hidden'>
                    <SignedIn>
                        <SignOutButton>
                            <div className='flex cursor-pointer'>
                                <Image src='/assets/logout.svg' alt='Logout' width={24} height={24} />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>

                {/* 必須要在網站上面的 Organizations Settings 那邊開啟才會顯示 */}
                <OrganizationSwitcher 
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger: 'py-2 px-4'
                        }
                    }}
                />
            </div>
        </nav>
    )
};

export default Topbar;