import { useState, useEffect } from "react";

import { menuApi } from '../../services/menuApi';
import { typeApi } from '../../services/typeApi';

import FoodList from "./FoodList";
import FoodForm from "./FoodForm";

function FoodContainer() {
  const [foodList, setFoodList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [editFood, setEditFood] = useState(null);

  // fetchFoods function
  const fetchFoods = async () => {
    try {
      const data = await menuApi.getAll();
      setFoodList(data);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    }
  };

  // fetchTypes function
  const fetchTypes = async () => {
    try {
      const data = await typeApi.getAll();
      setTypeList(data);
    } catch (error) {
      console.error("Failed to fetch types:", error);
    }
  };

  // load foodList typeList
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuData, typeData] = await Promise.all([
          menuApi.getAll(),
          typeApi.getAll()
        ]);
        setFoodList(menuData);
        setTypeList(typeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // delete food
  const deleteFood = async (id) => {
    try {
      await menuApi.delete(id);
      setFoodList((foodList) =>
        foodList.filter((food) => food.menuId !== id),
      );
    } catch (error) {
      console.error("Failed to delete menu:", error);
    }
  };

  // add food
  const addFood = async (newFood) => {
    try {
      await menuApi.create(newFood);
      await fetchFoods();
    } catch (error) {
      console.error("Failed to add menu:", error);
    }
  };

  // edit food
  const updateFood = async (id, food) => {
    try {
      await menuApi.update(id, food);
      await fetchFoods();
      setEditFood(null);
    } catch (error) {
      console.error("Failed to update menu:", error);
    }
  };

  return (<>
    <FoodList foodList={foodList} deleteFood={deleteFood} setEditFood={setEditFood} />
    <FoodForm addFood={addFood} updateFood={updateFood} editFood={editFood} typeList={typeList} />
  </>);
}

export default FoodContainer;
