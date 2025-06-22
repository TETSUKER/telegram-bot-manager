import React from "react";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
  onChange: (value: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  disabled,
  initialValue,
  onChange,
}) => {
  return (
    <label className="flex flex-col gap-y-2">
      {label && (
        <span className="font-normal text-slate-300 text-[16px]">{label}</span>
      )}
      <input
        className="
          bg-transparent border border-slate-300 text-slate-300 px-[8px] py-[5px] rounded-[5px] leading-[24px] text-[16px]
          focus-visible:outline-none disabled:border-slate-600
        "
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={!!disabled}
        value={initialValue}
      />
    </label>
  );
};
