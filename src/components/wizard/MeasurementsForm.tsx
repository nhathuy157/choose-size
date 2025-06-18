"use client";

import React from 'react';
import { useWizard } from '@/context/WizardContext';
import UnitToggle from '@/components/UnitToggle';
import { useRouter } from 'next/navigation';

export const MeasurementsForm: React.FC = () => {
  const router = useRouter();
  const { height, heightUnit, weight, weightUnit, setHeight, setHeightUnit, setWeight, setWeightUnit, gender, setGender } = useWizard();

  const handleContinue = () => {
    router.push('/wizard/belly-shape');
  };

  return (
    <div className="w-full mx-auto px-16">
      {/* Heading */}
      <h2 className="text-3xl font-semibold text-center">Thông số của bạn</h2>
      <p className="text-xl text-gray-600 text-center">Tìm size phù hợp cho bạn dựa trên thông tin cá nhân</p>
      {/* Stack inputs vertically */}
      <div className="flex flex-col gap-8 mt-8">
        {/* Chiều cao */}
        <div className="space-y-2 w-full">
          <label className="block text-xl font-medium">Chiều cao</label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              className="w-full h-14 px-6 border rounded-lg text-xl"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <UnitToggle
              options={[heightUnit, heightUnit === 'cm' ? 'in' : 'cm']}
              selected={heightUnit}
              onChange={(u) => setHeightUnit(u as 'cm' | 'in')}
            />
          </div>
        </div>
        {/* Cân nặng */}
        <div className="space-y-2 w-full">
          <label className="block text-xl font-medium">Cân nặng</label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              className="w-full h-14 px-6 border rounded-lg text-xl"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <UnitToggle
              options={[weightUnit, weightUnit === 'kg' ? 'lbs' : 'kg']}
              selected={weightUnit}
              onChange={(u) => setWeightUnit(u as 'kg' | 'lbs')}
            />
          </div>
        </div>
        {/* Giới tính */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-xl font-medium">Giới tính</label>
          <div className="grid grid-cols-2 gap-4">
            {['male', 'female'].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g as any)}
                className={`h-14 flex items-center justify-center rounded-lg border ${gender === g ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>
                {g === 'male' ? 'Nam' : 'Nữ'}</button>
            ))}
          </div>
        </div>
        {/* Continue button spanning both columns */}
        <div className="md:col-span-2">
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-medium py-6 rounded-full disabled:opacity-50"
            onClick={handleContinue}
            disabled={!(parseFloat(height) > 0 && parseFloat(weight) > 0 && gender)}
          >Tiếp tục</button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsForm;
