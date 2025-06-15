import React from 'react';

interface TableMasterCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

export const TableMasterCheckbox: React.FC<TableMasterCheckboxProps> = ({
  checked,
  indeterminate,
  onChange,
}) => {
  const handleChange = () => onChange();

  return (
    <input
      type="checkbox"
      checked={checked}
      ref={input => {
        if (input && indeterminate !== undefined) {
          input.indeterminate = indeterminate;
        }
      }}
      onChange={handleChange}
    />
  );
};