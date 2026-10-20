import { useState, useEffect } from "react";

const emptyInputs = { name: "", price: "", isBestSeller: "0", typeId: "" };

const FoodForm = ({ addFood, updateFood, editFood, typeList }) => {

  // state for form inputs
  const [inputs, setInputs] = useState(emptyInputs);

  // fill the form when a menu is selected for editing
  useEffect(() => {
    if (editFood) {
      setInputs({
        name: editFood.name,
        price: editFood.price,
        isBestSeller: editFood.isBestSeller ? "1" : "0",
        typeId: editFood.typeId,
      });
    } else {
      setInputs(emptyInputs);
    }
  }, [editFood]);

  // handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }

  // handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const food = {
      name: inputs.name,
      price: Number(inputs.price),
      isBestSeller: inputs.isBestSeller === "1",
      typeId: Number(inputs.typeId),
    };

    if (editFood) {
      await updateFood(editFood.menuId, food);
    } else {
      await addFood(food);
    }

    setInputs(emptyInputs);
  };

  // render the form
  return (
    <>
      <h3>{editFood ? "Edit Food" : "New Food"}</h3>
      <form onSubmit={handleSubmit}>
        <label> name :
          <input type="text" name="name" value={inputs.name} onChange={handleChange} required />
        </label>
        <br />
        <label> price :
          <input type="number" name="price" value={inputs.price} onChange={handleChange} required />
        </label>
        <br />
        <label> Type :
          <select name="typeId" value={inputs.typeId} onChange={handleChange} required>
            <option value="">-- select --</option>
            {typeList.map((item) => (
              <option key={item.typeId} value={item.typeId}>{item.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label> Best Seller :
          <select name="isBestSeller" value={inputs.isBestSeller} onChange={handleChange}>
            <option value="1">BestSeller</option>
            <option value="0">Normal</option>
          </select>
        </label>
        <br />
        <button type="submit">{editFood ? "Update menu" : "Add menu"}</button>
      </form>
    </>
  );
};
export default FoodForm;
