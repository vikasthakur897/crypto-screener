import CoinOverviewClient from './CoinOverviewClient';
import { CoinOverviewFallback } from './fallback';
import { fetcher } from '@/lib/coingecko.action';

const CoinOverview = async () => {
  let coin: CoinDetailsData | null = null;
  let coinOHLCData: OHLCData[] | null = null;

  try {
    [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>('/coins/bitcoin'),
      fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
      }),
    ]);
  } catch (error) {
    console.error('Error fetching coin overview:', error);
  }

  
  if (!coin || !coinOHLCData) {
    return <CoinOverviewFallback />;
  }

  return (
    <CoinOverviewClient
      coin={coin}
      coinOHLCData={coinOHLCData}
    />
  );
};

export default CoinOverview;
