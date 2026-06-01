// components/HoldersTable.jsx
const HoldersTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">PAIR</th>
            <th className="px-4 py-2">HOLDERS</th>
            <th className="px-4 py-2">BUY TAX</th>
            <th className="px-4 py-2">SELL TAX</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.pair} className="border-b border-gray-700">
              <td className="px-4 py-2">{item.pair}</td>
              <td className="px-4 py-2">{item.holders}</td>
              <td className="px-4 py-2 text-green-400">{item.buyTax}</td>
              <td className="px-4 py-2 text-red-400">{item.sellTax}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};