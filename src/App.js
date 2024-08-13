import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const initialDashboard = {
  categories: [
    {
      category_name: "CSPM Executive Dashboard",
      widgets: [
        { widget_id: "w1", widget_name: "Widget 1", widget_text: "Random text for Widget 1", widget_image: null },
        { widget_id: "w2", widget_name: "Widget 2", widget_text: "Random text for Widget 2", widget_image: null }
      ]
    },
    {
      category_name: "Security Dashboard",
      widgets: [
        { widget_id: "w3", widget_name: "Widget 3", widget_text: "Random text for Widget 3", widget_image: null }
      ]
    }
  ]
};

function App() {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [newWidgetName, setNewWidgetName] = useState('');
  const [newWidgetText, setNewWidgetText] = useState('');
  const [newWidgetImage, setNewWidgetImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAddWidget = () => {
    if (newWidgetName && newWidgetText && selectedCategory) {
      const newWidget = {
        widget_id: uuidv4(),
        widget_name: newWidgetName,
        widget_text: newWidgetText,
        widget_image: newWidgetImage ? URL.createObjectURL(newWidgetImage) : null
      };

      setDashboard((prevDashboard) => {
        return {
          ...prevDashboard,
          categories: prevDashboard.categories.map((category) => {
            if (category.category_name === selectedCategory) {
              return { ...category, widgets: [...category.widgets, newWidget] };
            }
            return category;
          })
        };
      });

      setNewWidgetName('');
      setNewWidgetText('');
      setNewWidgetImage(null);
      setSelectedCategory(null); // Reset the selected category after adding the widget
    }
  };

  const handleRemoveWidget = (categoryName, widgetId) => {
    setDashboard((prevDashboard) => {
      return {
        ...prevDashboard,
        categories: prevDashboard.categories.map((category) => {
          if (category.category_name === categoryName) {
            return {
              ...category,
              widgets: category.widgets.filter(widget => widget.widget_id !== widgetId)
            };
          }
          return category;
        })
      };
    });
  };

  const filteredCategories = dashboard.categories.map((category) => {
    return {
      ...category,
      widgets: category.widgets.filter((widget) =>
        widget.widget_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.widget_text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  });

  return (
    <div className="App">
      <button className="toggle-sidebar-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <span className="material-icons">
          {sidebarOpen ? 'close' : 'menu'}
        </span>
      </button>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>Dashboard</h2>
        <ul>
          {dashboard.categories.map((category, index) => (
            <li key={index}>
              <a href={`#category-${index}`}>{category.category_name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <h1>DYNAMIC DASHBOARD</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search widgets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filteredCategories.map((category, index) => (
          <div key={index} id={`category-${index}`} className="category">
            <h2>{category.category_name}</h2>
            <div className="widgets">
              {category.widgets.map((widget) => (
                <div key={widget.widget_id} className="widget">
                  {widget.widget_image && (
                    <img src={widget.widget_image} alt={widget.widget_name} className="widget-image" />
                  )}
                  <h3>{widget.widget_name}</h3>
                  <p>{widget.widget_text}</p>
                  <button className="remove-button" onClick={() => handleRemoveWidget(category.category_name, widget.widget_id)}>Remove Widget</button>
                </div>
              ))}
              <div
                className="add-widget-placeholder"
                onClick={() => setSelectedCategory(category.category_name)}
              >
                <div className="plus-icon">+</div>
              </div>
            </div>
          </div>
        ))}
        {selectedCategory && (
          <div className="add-widget-form">
            <h3>Add New Widget to {selectedCategory}</h3>
            <input
              type="text"
              placeholder="Widget Name"
              value={newWidgetName}
              onChange={(e) => setNewWidgetName(e.target.value)}
            />
            <textarea
              placeholder="Widget Text"
              value={newWidgetText}
              onChange={(e) => setNewWidgetText(e.target.value)}
            ></textarea>
            <input
              type="file"
              onChange={(e) => setNewWidgetImage(e.target.files[0])}
            />
            <button onClick={handleAddWidget}>Add Widget</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;