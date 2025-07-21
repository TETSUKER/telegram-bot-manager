import React from "react";

interface TimeInputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
  onChange: (value: string) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  label,
  placeholder = 'HH:MM',
  disabled,
  initialValue = '00:00',
  onChange,
}) => {
  const [timeValue, setTimeValue] = React.useState(initialValue);

  React.useEffect(() => {
    setTimeValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeValue(value);
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
          [&::-webkit-datetime-edit-ampm-field]:hidden
        "
        type="time"
        step="60"
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        value={timeValue}
      />
    </label>
  );
};
