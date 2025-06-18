"use client";

import { WizardProvider } from '@/context/WizardContext';
import { ReactNode } from 'react';

export default function WizardLayout({ children }: { children: ReactNode }) {
  return (
    // Full page background
    <div className="relative min-h-screen bg-blue-50 text-lg px-[15px] pt-24 pb-[15px] md:px-[50px] md:pt-32 md:pb-[50px]">
      <WizardProvider>
        {/* Main card container */}
        <div className="relative max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Card header */}
          <div className="bg-white border-b px-6 py-4 flex justify-center">
            <h1 className="text-3xl font-bold uppercase tracking-wide">CHỌN SIZE ÁO</h1>
          </div>
          {/* Card body with extra bottom padding */}
          <div className="px-6 pt-6 pb-10 text-lg">
            {children}
          </div>
        </div>
      </WizardProvider>
    </div>
  );
}