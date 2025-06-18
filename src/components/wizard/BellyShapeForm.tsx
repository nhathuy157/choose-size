"use client";

import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { useRouter } from 'next/navigation';

const options: { value: 'flatter' | 'average' | 'curvier'; label: string }[] = [
  { value: 'flatter', label: 'Phẳng' },
  { value: 'average', label: 'Bình thường / không biết' },
  { value: 'curvier', label: 'Cong' },
];

export const BellyShapeForm: React.FC = () => {
  const router = useRouter();
  const { bellyShape, setBellyShape } = useWizard();

  const handleContinue = () => router.push('/wizard/preference');

  return (
    // Giới hạn chiều rộng như form Measurements và căn giữa
    <div className="space-y-6 text-center max-w-full md:max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Dáng bụng của bạn</h2>
      <p className="text-xl text-gray-600">Chọn hình dáng bụng phù hợp với chiều cao & cân nặng của bạn</p>
      {/* Tùy chọn hình dạng: container giống sản phẩm, nút full width */}
      <div className="flex flex-col gap-4 max-w-full md:max-w-md mx-auto">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setBellyShape(opt.value)}
            className={`w-full p-4 rounded-[5px] text-base font-medium transition-colors ${
              bellyShape === opt.value
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <button onClick={() => router.back()} className="text-gray-500">
          Quay lại
        </button>
        <button
          onClick={handleContinue}
          disabled={!bellyShape}
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-[5px] text-lg font-medium px-4 py-2 disabled:opacity-50"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default BellyShapeForm;
