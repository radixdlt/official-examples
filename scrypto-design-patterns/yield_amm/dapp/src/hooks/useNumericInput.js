import { useState } from 'react';

export const useNumericInput = (initialValue = '10') => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  return [value, handleChange];
};
