import React, { useState, useEffect, useRef } from 'react';
import './FilterDropdown.css'; // Import your CSS file for styling

const FilterDropdown = ({onFilterSelect}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('All');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onFilterSelect(option)
    setIsOpen(false);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-select" onClick={toggleDropdown}>
        {selectedOption}
      </div>
      {isOpen && (
        <div className="dropdown-options">
          <div className="dropdown-option" onClick={() => handleOptionSelect('All')}>
            All
          </div>
          <div className="dropdown-option" onClick={() => handleOptionSelect('Favorite')}>
            Favorites
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
