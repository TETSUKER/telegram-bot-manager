import React from "react";

interface SelectorInputProps<T> {
  options: { value: T; text: string }[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: T;
  onChange: (value: T) => void;
}

export function SelectorInput<T extends string | number>({
  options,
  label,
  placeholder,
  disabled,
  initialValue,
  onChange,
}: SelectorInputProps<T>): React.JSX.Element {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) {
      onChange(value as unknown as T);
    } else {
      onChange(Number(value) as unknown as T);
    }
  };

  return (
    <label className="flex flex-col gap-y-2">
      {label && (
        <span className="font-normal text-slate-300 text-[16px]">{label}</span>
      )}
      <select
        value={initialValue}
        onChange={handleOnChange}
        disabled={!!disabled}
        className="
          bg-transparent border border-slate-300 text-slate-300 p-[8px] rounded-[5px] leading-none text-[16px]
          focus-visible:outline-none disabled:border-slate-600
        "
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} className="bg-transparent">
            {option.text}
          </option>
        ))}
      </select>
    </label>
  );
}
