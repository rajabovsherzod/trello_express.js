import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, length = 6 }) => {
  // inputRefs'ni endi oddiy massiv sifatida emas, balki elementlarga to'g'ridan-to'g'ri
  // murojaat qilish imkonini beradigan funksiya orqali boshqaramiz.
  const inputRefs = useRef<Array<HTMLInputElement>>([]);

  // Bu funksiya ref'larni to'g'ri ro'yxatga olishga yordam beradi
  const getRef = (index: number) => (el: HTMLInputElement | null) => {
    if (el) {
      inputRefs.current[index] = el;
    }
  };

  useEffect(() => {
    // Komponent birinchi marta render bo'lganda birinchi inputga fokus beramiz
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    if (newValue.length > 1) return;

    const newOtp = [...value.split('')];
    newOtp[index] = newValue;
    onChange(newOtp.join('').slice(0, length));

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    onChange(pastedData);
    const nextFocusIndex = pastedData.length < length ? pastedData.length : length - 1;
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={getRef(index)} // To'g'rilangan ref ishlatilishi
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-lg border-2",
            "bg-neutral-800/50 border-neutral-700 focus:border-primary focus:ring-2 focus:ring-primary/50",
            "transition-all duration-200 ease-in-out"
          )}
        />
      ))}
    </div>
  );
};