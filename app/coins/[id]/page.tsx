import { fetcher } from '@/lib/coingecko.action';
import { formatPercentage, formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import CandlestickChart from '@/components/CandlestickChart';


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoinPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Fetch Basic Metadata (checking if coin exists)
  const coin = await fetcher<CoinDetailsData>(`/coins/${id}`, {
    localization: 'false',
    tickers: 'false',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'false',
  });

  if (!coin || !coin.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold">Coin Not Found</h1>
        <p className="text-gray-400">Could not find data for "{id}"</p>
      </div>
    );
  }

  // 2. Fetch Initial Chart Data (OHLC)
  // Default to 1 day (daily) which maps to '1' day in API
  const ohlcData = await fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
     vs_currency: 'usd',
     days: '1',
  });


  const currentPrice = coin.market_data.current_price.usd;
  const priceChange24h = coin.market_data.price_change_percentage_24h_in_currency.usd;
  const isUp = priceChange24h >= 0;

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{coin.name}</h1>
            <div className="flex items-center  gap-2 text-gray-400">
              <span className="uppercase badge">{coin.symbol}</span>
              <span>#{coin.market_cap_rank}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-mono font-medium">
            {formatPrice(currentPrice)}
          </div>
          <div
            className={cn('text-lg font-medium', {
              'text-green-500': isUp,
              'text-red-500': !isUp,
            })}
          >
            {isUp ? '+' : ''}
            {formatPercentage(priceChange24h)} (24h)
          </div>
        </div>
      </header>

      {/* CHART SECTION */}
      <section className="card p-4 rounded-xl bg-[#0b1217] border border-[#1e293b]">
        <CandlestickChart
            coinId={id}
            data={ohlcData}
            initialPeriod="daily" 
            height={500}
        >
             <h2 className="text-lg font-semibold mb-4">Price Chart (USD)</h2>
        </CandlestickChart>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Market Cap" value={formatPrice(coin.market_data.market_cap.usd)} />
        <StatCard title="Volume (24h)" value={formatPrice(coin.market_data.total_volume.usd)} />
        <StatCard title="Circulating Supply" value={coin.market_data.circulating_supply.toLocaleString()} />
        <StatCard title="Total Supply" value={coin.market_data.total_supply?.toLocaleString() || 'N/A'} />
      </section>
      
      {/* DESCRIPTION */}
       {coin.description.en && (
        <section className="card p-6 rounded-xl bg-[#0b1217] border border-[#1e293b]">
          <h3 className="text-xl font-bold mb-4">About {coin.name}</h3>
          <div 
            className="prose prose-invert max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </section>
      )}

    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-[#111a22] border border-[#1e293b]">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-lg font-medium text-white">{value}</p>
    </div>
  );
}
