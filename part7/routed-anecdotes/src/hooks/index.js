import { useState } from "react"

const useField = () => {

  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  }

  return {
    value,
    onChange
  }

};

export default useField;