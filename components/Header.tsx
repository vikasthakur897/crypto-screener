'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


const Header = () => {
    const pathname = usePathname();
  return (
    <header>
      <div className='main-container inner'>
        <Link href="/" className='flex items-center py-4'>
         <Image src="/crypto-screener-icon.svg" alt="Crypto Screener Logo" width={30} height={20} />
            <span className='ml-2 text-xl font-bold '>CryptoScreener</span>
        </Link>

        <nav>
            <Link href="/" className={cn('nav-link', {'is-active': pathname === '/', 'is-home' : true})} >Home</Link>

            <p>Search Modal</p>

            <Link href="/coins" className={cn('nav-link', {'is-active': pathname === '/coins'})}>All Coins</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
