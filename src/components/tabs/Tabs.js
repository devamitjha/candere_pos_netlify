import React, { useState } from 'react';
import './tabs.scss';

const Tabs = ({children}) => {

   const [activeTab, setActiveTab] = useState(0);

   const tabHeaders = [];
   const tabPanels = [];

   React.Children.forEach(children, (child, index) => {
    if (child.type === TabHeader) {
      tabHeaders.push(
        React.cloneElement(child, {
          isActive: index === activeTab,
          onClick: () => setActiveTab(index),
        })
      );
    } else if (child.type === TabPanel) {
      tabPanels.push(child);
    }
  });

  return (
    <div className="tabs-container">
      <div className="tabs-headers">
        {tabHeaders}
      </div>
      <div className="tabs-panels">
        {tabPanels[activeTab]}
      </div>
    </div>
  )
}

const TabHeader = ({ isActive, onClick, children }) => (
    <div className={`tabs-header ${isActive ? 'active' : ''}`} onClick={onClick}>
      {children}
    </div>
);
  
// TabPanel component for tab content
const TabPanel = ({ children }) => (
    <div className="tabs-panel">
        {children}
    </div>
);

Tabs.TabHeader = TabHeader;
Tabs.TabPanel = TabPanel;
export default Tabs
