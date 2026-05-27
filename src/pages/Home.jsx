import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import LeftSidebar from "../components/layout/LeftSidebar.jsx";
import MainTable from "../components/home/MainTable.jsx";
import TrendChart from "../components/layout/RightSidebar/TrendChart.jsx";
import HotStockCard from "../components/layout/RightSidebar/HotStockCard.jsx";
import AlertCard from "../components/layout/RightSidebar/AlertCard.jsx";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex gap-5 px-6 py-6 flex-1 items-start">
        <LeftSidebar />

        <MainTable />

        <aside className="w-64 shrink-0 flex flex-col gap-4">
          <TrendChart />
          <HotStockCard />
          <AlertCard />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
