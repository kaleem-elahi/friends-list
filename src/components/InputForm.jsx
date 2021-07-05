import { useState } from 'react';


function InputForm() {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <input placeholder="Enter Friend Name" className="friend-field" name="friend-field" value={value} onChange={onChange} />
    </>
  );
}

export default InputForm;