import DateTable from '@/components/DateTable'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <main className="main-container">
      <section className='home-grid'>
        <div id="coin-overview">
          <div className='header'>
            <Image src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400" alt="Bitcoin Logo" width={20} height={10} />
            <div className='info'>
              <p>Bitcoin / BTC</p>
               <h1>$89,113.00</h1>
            </div>
          </div>
          </div>

        <p>Trading Coin</p>
        <DateTable columns={[]} data={[]} />
      </section>
      
      <section className='w-full mt-7 space-y-4'>
       <p>Category</p>
      </section>
    </main>
  )
}

export default page
