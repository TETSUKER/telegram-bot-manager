import React from 'react';

interface TableCheckboxProps {
  id: number;
  checked: boolean;
  onChange: (id?: number) => void;
}

export const TableCheckbox: React.FC<TableCheckboxProps> = ({
  id,
  checked,
  onChange,
}) => {
  const handleChange = () => onChange(id);

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
    />
  );
};