import { useState } from 'react'

function BMI() {
  const [weight, setWeight] = useState(" ");
  const [height, setHeight] = useState(" ");
  const [bmi, setBmi] = useState(" ");

  const calculateBMI = () => {
    const h = height / 100;
    const result = weight / (h * h);

    setBmi(result.toFixed(2));
  }


  return (
    <div>
      <h1>BMI CALCULATOR</h1>
      <input placeholder="Height" type='number' value={height} onChange={(e) => setHeight(e.target.value)} />

      <input placeholder="Weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />

      <button onClick={calculateBMI}>Calculate BMI</button>
    </div>
  )


};

export default BMI;