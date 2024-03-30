import React, { useState } from 'react';
import './Dropdown.css';

export interface SelectOption {
  text: string;
  value: string | number;
}

interface Props {
  name: string;
  label?: string;
  options: SelectOption[];
  onOptionSelect: (value: string | number) => void;
}

export const Dropdown: React.FC<Props> = ({
  name,
  label,
  options,
  onOptionSelect,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState<SelectOption['value']>();

  const handleSelect = (value: SelectOption['value']) => {
    setSelectedValue(value);
    onOptionSelect(value);
  };

  return (
    <div className="dropdown">
      {label && (
        <label className="dropdown__label" htmlFor={name}>
          {label}
        </label>
      )}
      <select
        name={name}
        className="dropdown__select"
        value={selectedValue}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
};
