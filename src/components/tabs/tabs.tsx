import React from 'react';
import './tabs.css';
import { FileI } from '../file-upload/file-upload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
interface TabProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
  isEdited?: boolean;
}
interface TabsProps {
  activeTab?: string | null;
  onTabChange: (file: FileI) => void;
  onTabClose: (file: FileI) => void;
  data: FileI[];
}


const Tab: React.FC<TabProps> = ({ title, isActive, isEdited, onClick, onClose }) => {
  return (
    <div className={`tab ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className={`${isEdited ? 'edited' : 'not-edited'}`}>
        <FontAwesomeIcon icon={faCircle} />
      </div>
      <p onClick={onClick}>{title}</p>
      <button className="tab-close-btn" onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}>x</button>
    </div>
  );
};

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, data, onTabClose}) => {
  const handleTabChange = (file: FileI) => {
    onTabChange(file);
  }
  const handleCloseTab = (file: FileI) => {
    onTabClose(file);
  }
  return (
    <div className='tabs'>
      {data.map((tab, index) => {
        return(
          <Tab 
            key={index}
            title={tab.name}
            isActive={activeTab === tab.name}
            isEdited={tab.changedContent !== tab.content}
            onClick={() => handleTabChange(tab)}
            onClose={() => handleCloseTab(tab)}
          />
        )
      })}
    </div>
  );
};

export default Tabs;