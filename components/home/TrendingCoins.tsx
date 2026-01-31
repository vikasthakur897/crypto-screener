import { fetcher } from "@/lib/coingecko.action";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DataTable from "../DataTable";
import { TrendingCoinsFallback } from "./fallback";

const TrendingCoins = async () => {
  let trandingCoins;

  try {
    trandingCoins = await fetcher<{ coins: TrendingCoin[] }>(
      "/search/trending",
      undefined,
      300
    );
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    return <TrendingCoinsFallback />;
  }

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: "Name",
      cell: (coin) => {
        const item = coin.item;
        return (
          <Link
            href={`/coins/${item.id}`}
            className="flex items-center gap-3 hover:opacity-80"
          >
            <Image
              src={item.large}
              alt={item.name}
              width={22}
              height={22}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-medium text-purple-100">
                {item.name}
              </span>
              <span className="text-xs text-purple-100/60 uppercase">
                {item.symbol}
              </span>
            </div>
          </Link>
        );
      },
    },
    {
      header: "24h",
      cell: (coin) => {
        const change =
          coin.item.data.price_change_percentage_24h.usd;
        const isUp = change > 0;

        return (
          <div
            className={cn(
              "flex items-center gap-1 font-medium",
              isUp ? "text-green-500" : "text-red-500"
            )}
          >
            {isUp ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {Math.abs(change).toFixed(2)}%
          </div>
        );
      },
    },
    {
      header: "Price",
      cell: (coin) => (
        <span className="font-medium text-purple-100">
          ${coin.item.data.price.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div
      id="trending-coins"
      className="bg-dark-400/30 rounded-lg p-4"
    >
      <h1 className="text-xl font-semibold mb-3">
        Trending Coins
      </h1>

      <DataTable
        columns={columns}
        data={trandingCoins.coins.slice(0, 6)}
        rowKey={(row) => row.item.id}
        tableClassName="trending-coin-table"
      />
    </div>
  );
};

export default TrendingCoins;
