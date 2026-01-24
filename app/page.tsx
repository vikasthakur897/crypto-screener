import DateTable from "@/components/DateTable";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: "Name",
    cellClassName: "name-cell",
    cell: (coin) => {
      const item = coin.item;
      return (
        <Link href={`/coins/${item.id}`}>
          <Image src={item.large} alt={item.name} width={20} height={20} />
          <p>{item.name}</p>
        </Link>
      );
    },
  },
  {
    header: "24h Change",
    cellClassName: "name-cell",
    cell: (coin) => {
      const item = coin.item;
      const isTrandingUp = item.data.price_change_percentage_24h.usd > 0;
      return (
        <div
          className={cn(
            "price-change",
            isTrandingUp ? "text-green-500" : "text-red-500",
          )}
        >
          <p>
            {isTrandingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
            {Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%
          </p>
        </div>
      );
    },
  },
  {
    header: "Price",
    cellClassName: "name-cell",
    cell: (coin) => {
      const item = coin.item;
      return <p>${item.data.price}</p>;
    },
  },
];

const dummyData: TrendingCoin[] = [
  {
    item: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "btc",
      market_cap_rank: 1,
      thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
      large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      data: {
        price: 89113,
        price_change_percentage_24h: {
          usd: 2.45,
        },
      },
    },
  },
  {
    item: {
      id: "ethereum",
      name: "Ethereum",
      symbol: "eth",
      market_cap_rank: 2,
      thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
      large: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      data: {
        price: 4620,
        price_change_percentage_24h: {
          usd: -1.32,
        },
      },
    },
  },
];

const page = () => {
  return (
    <main className="main-container">
      <section className="home-grid">
        <div id="coin-overview">
          <div className="header">
            <Image
              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400"
              alt="Bitcoin Logo"
              width={20}
              height={10}
            />
            <div className="info">
              <p>Bitcoin / BTC</p>
              <h1>$89,113.00</h1>
            </div>
          </div>
        </div>

        <p>Trading Coin</p>
        <DateTable
          columns={columns}
          data={dummyData}
          rowKey={(row) => row.item.id}
          tableClassName="trending-coin-table"
        />
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Category</p>
      </section>
    </main>
  );
};

export default page;
