// src/components/TokenList.jsx

const formatNumber = (num) => {
  if (!num) return "$0";

  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }

  if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`;
  }

  return `$${num.toFixed(2)}`;
};

const TokenList = ({
  tokens,
  loading,
  onSelect,
}) => {
  if (loading) {
    return (
      <div className="bg-[#131722] rounded-lg border border-gray-800 p-4">
        Loading pairs...
      </div>
    );
  }

  return (
    <div className="bg-[#131722] rounded-lg border border-gray-800 overflow-hidden">
      <div className="overflow-x-auto max-h-[350px]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[#1a1f2e] text-gray-400 z-10">
            <tr>
              <th className="text-left p-3">PAIR</th>
              <th className="text-left p-3">PRICE</th>
              <th className="text-left p-3">24H VOL</th>
              <th className="text-left p-3">MCAP</th>
              <th className="text-left p-3">LIQUIDITY</th>
            </tr>
          </thead>

          <tbody>
            {tokens?.map((token) => (
              <tr
                key={token.pairAddress}
                onClick={() => onSelect?.(token)}
                className="border-t border-gray-800 hover:bg-[#1a1f2e] cursor-pointer transition-colors"
              >
                <td className="p-3 font-semibold">
                  {token.symbol}
                </td>

                <td className="p-3 text-green-400">
                  ${token.price?.toFixed(6)}
                </td>

                <td className="p-3">
                  {formatNumber(token.volume)}
                </td>

                <td className="p-3">
                  {formatNumber(token.marketCap)}
                </td>

                <td className="p-3">
                  {formatNumber(token.liquidity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenList;