'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import CandlestickChart from '@/components/CandlestickChart';
import { LiveInterval } from '@/types/chart';

interface Props {
  coin: CoinDetailsData;
  coinOHLCData: OHLCData[];
}

const CoinOverviewClient = ({ coin, coinOHLCData }: Props) => {
  const [liveInterval, setLiveInterval] = useState<LiveInterval>('1s');

  return (
    <div id="coin-overview">
      <CandlestickChart
        data={coinOHLCData}
        coinId="bitcoin"
        liveInterval={liveInterval}
        setLiveInterval={setLiveInterval}
      >
        <div className="header pt-2 flex items-center gap-3">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={56}
            height={56}
          />

          <div className="info">
            <p>
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <h1>
              {formatCurrency(
                coin.market_data.current_price.usd
              )}
            </h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default CoinOverviewClient;
