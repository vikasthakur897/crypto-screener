import { fetcher } from "@/lib/coingecko.action";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DateTable from "../DateTable";

const TrendingCoins = async () => {
  const trandingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    "/search/trending",
    undefined,
    300,
  );

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
  return (
    <div id="trending-coins">
      <h4>Trading Coin</h4>
      <div id="trending-coins">
      <DateTable
        columns={columns}
        data={trandingCoins.coins.slice(0,6) || []}
        rowKey={(row) => row.item.id}
        tableClassName="trending-coin-table"
      />
      </div>
    </div>
  );
};

export default TrendingCoins;
