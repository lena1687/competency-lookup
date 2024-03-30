import React, { useState } from 'react';

interface RadioOption {
  text: string;
  value: string | number;
}

interface Props {
  name: string;
  options: RadioOption[];
  onChange: (value: RadioOption['value'] | null) => void;
}

export const RadioGroup: React.FC<Props> = ({ name, options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<
    RadioOption['value'] | null
  >(null);

  const handleOptionChange = (value: RadioOption['value']) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="radio-group">
      {options.map((option, index) => (
        <label key={index}>
          <input
            name={name}
            type="radio"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={(e) => handleOptionChange(e.target.value)}
          />
          {option.text}
        </label>
      ))}
    </div>
  );
};
