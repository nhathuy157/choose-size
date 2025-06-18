"use client";

import React from "react";
import { useWizard } from "@/context/WizardContext";
import { useRouter } from "next/navigation";

const products = [
  { value: 'polo', label: 'Áo thun cổ bẻ' },
  { value: 'round', label: 'Áo thun cổ tròn' },
  { value: 'shirt', label: 'Áo sơ mi' },
  { value: 'spa', label: 'Áo spa' },
  { value: 'pants', label: 'Quần tây' },
];

export default function ProductPage() {
  const router = useRouter();
  const { product, setProduct } = useWizard();

  const handleContinue = () => router.push('/wizard/measurements');

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Chọn sản phẩm</h2>
      <p className="text-2xl text-gray-600">Xin vui lòng chọn sản phẩm bạn muốn đo size:</p>
      {/* Danh sách sản phẩm */}
      <div className="flex flex-col gap-4 max-w-full md:max-w-md mx-auto">
        {products.map((p) => (
          <button
            key={p.value}
            onClick={() => setProduct(p.value)}
            className={`w-full p-4 rounded text-xl font-medium transition-colors ${
              product === p.value
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleContinue}
        disabled={!product}
        className="mt-4 w-full max-w-xs bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-medium py-3 rounded-[25px] disabled:opacity-50"
      >
        Tiếp tục
      </button>
    </div>
  );
}