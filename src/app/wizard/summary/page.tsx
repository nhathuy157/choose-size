"use client";

import React from "react";
import { useWizard } from "@/context/WizardContext";
import { sizeCharts, SizeChartEntry } from '@/data/sizeCharts';
import { useRouter } from 'next/navigation';

export default function SummaryPage() {
  const { product, height, heightUnit, weight, weightUnit, gender, bellyShape, preference } = useWizard();
  const router = useRouter();
  // Map values for message
  const productLabels: Record<string, string> = {
    polo: 'Áo thun cổ bẻ',
    round: 'Áo thun cổ tròn',
    shirt: 'Áo sơ mi',
    spa: 'Áo spa',
    pants: 'Quần tây',
  };
  const genderLabel = gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : '';
  const bellyLabels: Record<string, string> = {
    flatter: 'Bụng phẳng',
    average: 'Bụng bình thường',
    curvier: 'Bụng to',
  };
  const prefLabels: Record<number, string> = {
    1: 'Ôm sát', 2: 'Ôm', 3: 'Hơi ôm', 4: 'Vừa vặn',
    5: 'Hơi rộng', 6: 'Rộng', 7: 'Rất rộng',
  };
  // Prepare Zalo message
  const zaloMessage = `Tôi quan tâm sản phẩm ${productLabels[product]}. Thông số của tôi: chiều cao ${height}${heightUnit}, cân nặng ${weight}${weightUnit}, giới tính ${genderLabel}, dáng bụng ${bellyLabels[bellyShape]}, sở thích độ ôm ${prefLabels[preference]}. Tôi muốn tư vấn size.`;

  const [mainEntry, setMainEntry] = React.useState<SizeChartEntry | null>(null);
  const [altEntry, setAltEntry] = React.useState<SizeChartEntry | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');
  // list to hold full chart when no match
  const [chartList, setChartList] = React.useState<SizeChartEntry[]>([]);

  React.useEffect(() => {
    const weightNum = parseFloat(weight) || 0;
    // select chart based on product and gender (pants only)
    const chart = product === 'pants'
      ? sizeCharts.pants.filter(e => e.gender === gender)
      : sizeCharts[product as keyof typeof sizeCharts];
    if (!chart || chart.length === 0) {
      // no matching chart entries, show full chart for user reference
      setChartList(
        product === 'pants'
          ? sizeCharts.pants
          : sizeCharts[product as keyof typeof sizeCharts]
      );
      setError('Không tìm thấy size phù hợp. Tham khảo bảng size bên dưới.');
      setLoading(false);
      return;
    }
    // find matching index by weight
    let idx = chart.findIndex(e => weightNum >= (e.weightMinKg ?? 0) && weightNum <= (e.weightMaxKg ?? Infinity));
    if (idx < 0) idx = 0;
    // base selected index = idx
    let selectedIdx = idx;
    // belly shape 'curvier' always +1 size
    if (bellyShape === 'curvier') selectedIdx = Math.min(idx + 1, chart.length - 1);
    // very wide preference (7) also +1 size if not already
    else if (preference === 7) selectedIdx = Math.min(idx + 1, chart.length - 1);
    // set main entry based on selected index
    setMainEntry(chart[selectedIdx]);
    // set alternative neighbor for suggestions
    const nextIdx = Math.min(idx + 1, chart.length - 1);
    setAltEntry(chart[nextIdx]);
    setLoading(false);
  }, [product, weight, gender, bellyShape, preference]);

  return (
    <div className="p-5 space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-center">Kết quả gợi ý kích thước</h2>
      {loading && <p className="text-center">Đang tính toán...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {/* Render full chart if no match and chartList has entries */}
      {!loading && error && chartList.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1">Size</th>
                <th className="border px-2 py-1">Min (kg)</th>
                <th className="border px-2 py-1">Max (kg)</th>
              </tr>
            </thead>
            <tbody>
              {chartList.map((e, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{e.size}</td>
                  <td className="border px-2 py-1">{e.weightMinKg ?? '-'}</td>
                  <td className="border px-2 py-1">{e.weightMaxKg ?? '∞'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && mainEntry && (
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg rounded-lg p-8 text-center space-y-4">
          <h3 className="text-2xl font-semibold">Size đề xuất của bạn</h3>
          <p className="mt-4 text-5xl font-bold">{mainEntry.size}</p>
          <p className="mt-2 text-lg">
            Sau khi nhận thông tin và xử lý, size <strong>{mainEntry.size}</strong> phù hợp với bạn nhất.
          </p>
          {/* Suggest half-size if preference 5-6 */}
          {preference >= 5 && preference < 7 && (
            <p className="text-lg">Bạn có thể thử size <strong>{altEntry?.size}</strong> để rộng hơn 1 chút.</p>
          )}
        </div>
      )}
      {/* Action buttons moved outside */}
      {!loading && !error && mainEntry && (
        <div className="mt-8 flex justify-center space-x-36">
          <button
            onClick={() => router.push('/wizard')}
            className="w-48 px-8 py-4 border border-blue-600 text-blue-600 rounded-lg text-lg font-medium"
          >Thử lại<i></i></button>
          <button
            onClick={() => window.open(
              `https://zalo.me/0916025623?text=${encodeURIComponent(zaloMessage)}`,
              '_blank'
            )}
            className="w-48 px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium"
          >Tư vấn trực tiếp</button>
        </div>
      )}
    </div>
  );
}