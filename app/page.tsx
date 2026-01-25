import DateTable from "@/components/DateTable";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoins";




const page = async() => {

  

  
  return (
    <main className="main-container">
      <section className="home-grid">
        <CoinOverview />



        
        <TrendingCoins />
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Category</p>
      </section>
    </main>
  );
};

export default page;
