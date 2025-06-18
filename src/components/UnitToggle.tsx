// Nhập React để hỗ trợ JSX
import React from 'react';

// Định nghĩa props cho toggle: hai tùy chọn, giá trị đang chọn và hàm xử lý thay đổi
interface UnitToggleProps {
  options: [string, string];
  selected: string;
  onChange: (unit: string) => void;
}

// Component hiển thị hai nút đơn vị
const UnitToggle: React.FC<UnitToggleProps> = ({ options, selected, onChange }) => {
  return (
    // Container cố định chiều rộng, chia đều cho 2 nút
    <div className="flex-none flex h-12 bg-blue-100 rounded-lg overflow-hidden w-20 sm:w-24 md:w-28">
      {options.map((opt) => (
        <button
          key={opt}
          className={`flex-1 h-full text-xl font-medium ${
            selected === opt ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
          }`}
          onClick={() => onChange(opt)}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

// Export component để sử dụng trong form
export default UnitToggle;