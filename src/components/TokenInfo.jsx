export default function TokenInfo({ token }) {
  const formatNum = (num) => {
    if (!num) return "$0";

    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }

    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }

    return `$${Number(num).toFixed(2)}`;
  };

  if (!token) {
    return (
      <div className="bg-[#131722] border border-gray-800 rounded-lg p-4 text-white">
        Loading token...
      </div>
    );
  }

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-lg p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

        <div>
          <div className="text-xs text-gray-400">Pair Age</div>
          <div className="font-bold text-white">2h</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Holders</div>
          <div className="font-bold text-white">0</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Buy Tax</div>
          <div className="font-bold text-green-400">0%</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Sell Tax</div>
          <div className="font-bold text-red-400">0%</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Total Vol</div>
          <div className="font-bold text-white">
            {formatNum(token.volume)}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Total TX</div>
          <div className="font-bold text-white">0</div>
        </div>

      </div>
    </div>
  );
}