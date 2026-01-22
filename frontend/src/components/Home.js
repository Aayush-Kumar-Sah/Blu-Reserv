import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Home.css';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getAll();
      setRestaurants(response.restaurants);
    } catch (error) {
      toast.error('Failed to load restaurants');
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading restaurants...</div>;
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h2>Welcome to Food Court</h2>
        <p>Discover amazing dining experiences at our diverse restaurants</p>
      </div>

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="restaurant-card">
            <div className="restaurant-image" style={{
              background: !restaurant.image || restaurant.image.includes('default') 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : undefined
            }}>
              {restaurant.image && !restaurant.image.includes('default') ? (
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="image-placeholder">
                  <span className="placeholder-icon">🍽️</span>
                  <span className="placeholder-text">{restaurant.name}</span>
                </div>
              )}
              <div className="cuisine-badge">{restaurant.cuisine}</div>
            </div>
            <div className="restaurant-info">
              <h3>{restaurant.name}</h3>
              <p className="restaurant-description">{restaurant.description}</p>
              <div className="restaurant-details">
                <div className="detail-item">
                  <span className="icon">🕒</span>
                  <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="no-restaurants">
          <p>No restaurants available at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
