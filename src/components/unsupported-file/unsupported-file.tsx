import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import './unsupported-file.css';


const UnsupportedFile = () => (
  <div className='no-file-selected'>
    <FontAwesomeIcon icon={faBan} className='no-file-icon' />
    <div className='no-file-title'>This file is not supported</div>
    <div className='no-file-subtitle'>
      Please select another file to display its contents
    </div>
  </div>
);

export default UnsupportedFile;
