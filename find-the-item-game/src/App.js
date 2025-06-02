import React, { useState } from 'react';
import './App.css';

const createItems = () => {
  const items = Array.from({ length: 36 }, () => ({
    hasItem: false,
    clicked: false,
  }));
  const index = Math.floor(Math.random() * 36);
  items[index].hasItem = true;
  return items;
};

function App() {
  const [items, setItems] = useState(createItems);
  const [tries, setTries] = useState(0);
  const [found, setFound] = useState(false);

  const handleClick = (index) => {
    if (items[index].clicked || found) return;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      clicked: true,
    };
    setItems(newItems);
    setTries(tries + 1);
    if (newItems[index].hasItem) {
      setFound(true);
    }
  };

  const handleReset = () => {
    setItems(createItems());
    setTries(0);
    setFound(false);
  };

  return (
    <div className="App">
      <h1>Find the Hidden Item</h1>
      <div className="grid">
        {items.map((item, index) => (
          <div
            key={index}
            className={`cell ${item.clicked ? 'open' : ''}`}
            onClick={() => handleClick(index)}
          >
            {item.clicked && item.hasItem ? 'O' : ''}
          </div>
        ))}
      </div>
      <p>Tries: {tries}</p>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default App;