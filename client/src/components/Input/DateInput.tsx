import React from "react";

interface DateInputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
  onChange: (value: string) => void;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  placeholder = 'HH:MM',
  disabled,
  initialValue = '00:00',
  onChange,
}) => {
  const [dateValue, setDateValue] = React.useState(initialValue);

  React.useEffect(() => {
    setDateValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateValue(value);
    onChange(value);
  };

  return (
    <label className="flex flex-col gap-y-2">
      {label && (
        <span className="font-normal text-slate-300 text-[16px]">{label}</span>
      )}
      <input
        className="
          bg-transparent border border-slate-300 text-slate-300 p-[8px] rounded-[5px]
          leading-none text-[16px] focus-visible:outline-none disabled:border-slate-600
        "
        type="date"
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        value={dateValue}
      />
    </label>
  );
};
