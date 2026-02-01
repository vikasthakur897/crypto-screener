import { fetcher } from '@/lib/coingecko.action'
import React from 'react'
import Image from 'next/image'
import DataTable from '../DataTable'
import { cn, formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

const Categories = async () => {
    const categories = await fetcher<Category[]>('/coins/categories')

    const columns : DataTableColumn<Category>[] = [
        { header: 'Category', cellClassName:'category-cell', cell: (category) => category.name},
        {
            header: 'Top Gainers',
            cellClassName: 'top-gainers-cell',
            cell: (category) => {
                return (
                    <div className="flex space-x-2">
                        {category.top_3_coins.map((coin) => (
                            <Image src={coin} alt={coin} key={coin} width="28" height="28" />
                        ))}
                    </div>
                )
            }
        },
        {
            header: '24h change',
            cellClassName: 'change-cell',
             cell: (category) => {
        const change =
          category.market_cap_change_24h;
        const isUp = change > 0;

        return (
          <div
            className={cn(
              "change-cell000",
              isUp ? "text-green-500" : "text-red-500"
            )}
          >
            <p className='flex items-center'>
            {isUp ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {Math.abs(change).toFixed(2)}%
            </p>
          </div>
        );
      },
        },
        {
            header: 'Market Cap',
            cellClassName: 'market-cap-cell',
            cell: ((category) => formatCurrency(category.market_cap))
        },
         {
            header: '24h Volume',
            cellClassName: 'volume-cell',
            cell: ((category) => formatCurrency(category.volume_24h))
        }
    ]
  return (
    <div id="categories" className='custom-scrollbar'>
      <h4>Top Categories</h4>

      <DataTable columns={columns} data={categories?.slice(0, 10) || []} rowKey={(_, index) => index} tableClassName='mt-3' />
    </div>
  )
}

export default Categories
