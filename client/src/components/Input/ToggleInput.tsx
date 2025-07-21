import React from "react";

interface ToggleInputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: boolean;
  onChange: (value: boolean) => void;
}

export const ToggleInput: React.FC<ToggleInputProps> = ({
  label,
  placeholder,
  disabled,
  initialValue = false,
  onChange,
}) => {
  const [checked, setChecked] = React.useState<boolean>(initialValue);

  const handleChange = () => {
    if (disabled) return;
    const newChecked = !checked;
    setChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="me-3 font-normal text-slate-300 text-[16px]">{label}</span>
      <input
        type="checkbox"
        placeholder={placeholder}
        onChange={handleChange}
        disabled={!!disabled}
        checked={checked}
        className="sr-only peer"
      />
      <div
        className="
          relative w-11 h-6 rounded-full peer peer-checked:bg-blue-600 bg-gray-700
          peer-checked:after:translate-x-full peer-checked:after:border-white
          rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute
          after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300
          after:border after:rounded-full after:h-5 after:w-5 after:transition-all
        "
      ></div>
    </label>
  );
};
