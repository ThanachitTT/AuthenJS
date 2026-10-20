const FoodList = ({ foodList, deleteFood, setEditFood }) => {
  return (<div>
    <h2>Our Menu</h2>
    <ul>
      {foodList.map(
        (item) => (<li key={item.menuId}>
          {item.name} - {item.price} baht {item.isBestSeller ? "🏅" : ""}
          <button onClick={() => deleteFood(item.menuId)}>Delete</button>
          <button onClick={() => setEditFood(item)}>Edit</button>
        </li>)
      )}
    </ul>
  </div>
  );
}
export default FoodList;
