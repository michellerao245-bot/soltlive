import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [pairs, setPairs] = useState([]);
  const [filteredPairs, setFilteredPairs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadPairs();
  }, []);

  useEffect(() => {
    const filtered = pairs.filter((pair) =>
      `${pair.baseToken?.symbol}/${pair.quoteToken?.symbol}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredPairs(filtered);
  }, [search, pairs]);

  const loadPairs = async () => {
    try {
      const res = await fetch(
        "https://api.dexscreener.com/latest/dex/search?q=wbnb"
      );

      const data = await res.json();

      const bscPairs =
        data?.pairs?.filter(
          (pair) => pair.chainId?.toLowerCase() === "bsc"
        ) || [];

      setPairs(bscPairs);
      setFilteredPairs(bscPairs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (num) => {
    if (!num) return "$0";

    if (num >= 1000000)
      return `$${(num / 1000000).toFixed(2)}M`;

    if (num >= 1000)
      return `$${(num / 1000).toFixed(2)}K`;

    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white">

      {/* HEADER */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          EcoLive
        </h1>

        <input
          type="text"
          placeholder="Search token..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#131722] border border-gray-700 rounded-lg px-4 py-2 w-72 outline-none"
        />
      </div>

      {/* TRENDING */}
      <div className="px-6 py-3 border-b border-gray-800">
        <div className="flex gap-4 overflow-x-auto">
          <span className="text-green-400">🔥 Trending</span>
          <span>BNB</span>
          <span>PEPE</span>
          <span>DOGE</span>
          <span>FLOKI</span>
          <span>SHIB</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="p-4">

        {loading ? (
          <div className="text-center py-20">
            Loading pairs...
          </div>
        ) : (
          <div className="bg-[#131722] rounded-xl border border-gray-800 overflow-hidden">

            <div className="overflow-auto max-h-[80vh]">

              <table className="w-full">

                <thead className="sticky top-0 bg-[#1a1f2e] text-gray-400 text-sm">
                  <tr>
                    <th className="text-left p-4">PAIR</th>
                    <th className="text-left p-4">PRICE</th>
                    <th className="text-left p-4">MCAP</th>
                    <th className="text-left p-4">LIQUIDITY</th>
                    <th className="text-left p-4">24H VOL</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredPairs.map((pair) => (
                    <tr
                      key={pair.pairAddress}
                      onClick={() =>
                        navigate(`/token/${pair.pairAddress}`)
                      }
                      className="cursor-pointer border-t border-gray-800 hover:bg-[#1a1f2e] transition"
                    >
                      <td className="p-4 font-semibold">
                        {pair.baseToken?.symbol}/
                        {pair.quoteToken?.symbol}
                      </td>

                      <td className="p-4 text-green-400">
                        $
                        {Number(
                          pair.priceUsd || 0
                        ).toFixed(6)}
                      </td>

                      <td className="p-4">
                        {formatMoney(
                          Number(pair.marketCap || 0)
                        )}
                      </td>

                      <td className="p-4">
                        {formatMoney(
                          Number(
                            pair.liquidity?.usd || 0
                          )
                        )}
                      </td>

                      <td className="p-4">
                        {formatMoney(
                          Number(
                            pair.volume?.h24 || 0
                          )
                        )}
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}