import React from "react";

interface NumberInputProps {
  min: number;
  max: number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: number;
  onChange: (value: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  placeholder,
  disabled,
  initialValue = 0,
  min = 0,
  max = 1,
  onChange,
}) => {
  return (
    <label className="flex flex-col gap-y-2">
      {label && (
        <span className="font-normal text-slate-300 text-[16px]">{label}</span>
      )}
      <input
        className="
          bg-transparent border border-slate-300 text-slate-300 p-[8px] rounded-[5px] leading-none text-[16px]
          focus-visible:outline-none disabled:border-slate-600
        "
        type="number"
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={!!disabled}
        value={initialValue}
        min={min}
        max={max}
      />
    </label>
  );
};
