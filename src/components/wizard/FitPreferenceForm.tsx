import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { useRouter } from 'next/navigation';

// Mapping giá trị slider sang nhãn tiếng Việt
const labels: Record<number, string> = {
  1: 'Ôm sát',
  2: 'Ôm',
  3: 'Hơi ôm',
  4: 'Vừa vặn',
  5: 'Hơi rộng',
  6: 'Rộng',
  7: 'Rất rộng',
};

export const FitPreferenceForm: React.FC = () => {
  const router = useRouter();
  const { preference, setPreference } = useWizard();

  const handleContinue = () => router.push('/wizard/summary');

  return (
    // Tăng khoảng cách dọc giữa các mục để form dài ra hơn
    <div className="space-y-6 px-6 text-center mb-2 ">
      <div className="pt-6 pb-2">
        <h2 className="text-2xl font-bold">Sở thích độ ôm</h2>
        <p className="text-base text-gray-600 pt-2">
          Chọn mức độ ôm sát bạn mong muốn cho chiếc áo này
        </p>
      </div>
      {/* Tăng margin giữa title và slider */}
      <div className="relative w-full max-w-lg mx-auto px-4 py-4 mt-8 mb-6">
        <input
          type="range"
          min={1}
          max={7}
          step={1}
          value={preference}
          onChange={(e) => setPreference(Number(e.target.value))}
          className="w-full h-3 md:h-4"
        />
        {/* Tooltip label above thumb */}
        <div
          className="absolute -top-10 text-base bg-white px-3 py-1 rounded shadow"
          style={{
            left: `${((preference - 1) / 6) * 100}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {labels[preference]}
        </div>
      </div>
      {/* Nhãn đầu/cuối align cùng slider */}
      <div className="relative w-full max-w-lg mx-auto flex justify-between text-base text-gray-600 px-4 mt-2 mb-6">
        <span>{labels[1]}</span> {/* Rất ôm sát */}
        <span>{labels[7]}</span> {/* Rất rộng */}
      </div>
       {/* Nút action cách đáy ~10px */}
      <div className="flex justify-between px-4 mt-10 pt-6">
        <button onClick={() => router.back()} className="text-gray-500 text-lg">
          Quay lại
        </button>
        <button
          onClick={handleContinue}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg text-lg font-medium px-4 py-2 disabled:opacity-50"
        >
          Tiếp tục
        </button>
      </div>
     
    </div>
  );
};

export default FitPreferenceForm;
