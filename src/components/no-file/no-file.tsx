import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopFile } from '@fortawesome/free-solid-svg-icons';
import './no-file.css';


const NoFileSelected = () => (
  <div className='no-file-container'>
    <FontAwesomeIcon icon={faLaptopFile} className='no-file-icon' />
    <div className='no-file-title'>No file selected</div>
    <div className='no-file-subtitle'>
      Please select a file to display its contents
    </div>
  </div>
);

export default NoFileSelected;
