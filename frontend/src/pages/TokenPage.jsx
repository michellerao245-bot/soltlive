import { useParams } from "react-router-dom";
import PriceChart from "../components/PriceChart";
import TokenInfo from "../components/TokenInfo";
import LiveTrades from "../components/LiveTrades";
import BuySellPanel from "../components/BuySellPanel";

export default function TokenPage() {
  const { pairAddress } = useParams();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white">

      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <h1 className="text-2xl font-bold">
          Token Details
        </h1>

        <p className="text-gray-500 text-sm break-all">
          {pairAddress}
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 gap-4 p-4">

        {/* Left Side */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">

          <TokenInfo pairAddress={pairAddress} />

          <div className="bg-[#131722] rounded-xl border border-gray-800 p-3">
            <PriceChart />
          </div>

        </div>

        {/* Right Side */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">

          <BuySellPanel pairAddress={pairAddress} />

          <LiveTrades pairAddress={pairAddress} />

        </div>

      </div>

    </div>
  );
}