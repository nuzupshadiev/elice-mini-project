import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const NoFileSelectedContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #3A3A4C;
  background-color: #717179;
  flex-direction: column;
  text-align: center;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 64px; 
  margin-bottom: 24px;
  color: #3A3A4C; 
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Subtitle = styled.div`
  font-size: 16px;
`;

const UnsupportedFile = () => (
  <NoFileSelectedContainer>
    <StyledFontAwesomeIcon icon={faBan} />
    <Title>This file is not supported</Title>
    <Subtitle>Please select another file to display its contents</Subtitle>
  </NoFileSelectedContainer>
);

export default UnsupportedFile;
