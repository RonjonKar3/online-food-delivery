import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2>Your Favorite Flavors, Just a Click Away</h2>
      <div className="food-display-list">
        {food_list.map((item) => {
          // Only show food items based on selected category
          if (category === 'All' || category === item.category) {
            return (
              <FoodItem
                key={item._id} // Use item._id for the key for uniqueness and better React rendering
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null; // Ensure returning null for items not displayed
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
