import { useState } from "react";

export const useNumericInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (input) => {
    const inputValue = input && input.target ? input.target.value : input;
    if (/^\d*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  return [value, handleChange];
};
