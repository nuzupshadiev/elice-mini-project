# Code Editor with Zip File Handling

## Overview
This project is a React-based web application that allows users to upload and edit the contents of a zip file in a user-friendly interface. It utilizes the Monaco editor for editing text files and displays non-editable files accordingly. The main feature includes handling zip file uploads, displaying the file structure, editing content, and downloading the modified zip file.

## Features
- Upload zip files either through a standard file input or via drag and drop.
- Display the contents of the zip file in a tree view.
- Edit text files directly in the Monaco editor integrated into the application.
- View images from the zip file directly in the browser.
- View pdf files from the zip file directly in the browser.
- Download the modified contents of the zip file.
- Additional features like undo/redo commands, syntax highlighting, and theme support in the Monaco editor.

## Technical Requirements
- Direct usage of the `monaco-editor` package without third-party wrappers.

## Architecture

This project is built using a component-based architecture, where each part of the application is encapsulated in its own React functional component. This approach enhances reusability and modularity, making the codebase more maintainable and scalable. Here's a breakdown of the architectural design:

### Components
- **FileUploader:** Handles the uploading of zip files, either through a traditional file input or drag-and-drop mechanism. This component is responsible for reading the zip file and parsing its contents.
- **FileTree:** Displays the contents of the uploaded zip file in a hierarchical tree structure. It allows users to select a file to view or edit.
- **Editor:** Integrates the Monaco editor for editing text files. This component is dynamically updated based on user interactions with the FileTree.
- **ImageViewer:** A component for displaying image files directly from the zip without editing capabilities.
- **PDFViewer:** A component for displaying PDF files directly from the zip without editing capabilities.
- **Tabs:** A component for displaying tabs.

### State Management
- Instead of using complex state management libraries like Redux or Context API, the application relies on the `useState` hook to manage local state within each component. This approach keeps the implementation straightforward and efficient, suitable for the scope of the project.

### Data Flow
- The data flow between components is handled via props and state hooks, ensuring that each component remains independent and only manages its relevant state. This design supports the reusability of components across different parts of the application or in different projects.

### Reusability and Functionality
- All components are designed to be reusable and are crafted as functional components using React Hooks. This not only adheres to modern React best practices but also ensures that each component can be independently managed and tested.


This architecture supports the application's requirement for handling potentially complex interactions with zip files while maintaining a user-friendly interface. It allows for future enhancements and integration into larger systems with minimal adjustments.


## Binary or Text File determination

In this TypeScript code, I've developed a function to determine whether a buffer contains text or binary data. The approach is to examine the buffer's content by interpreting it as UTF-8 text and checking for any decoding issues that might indicate binary data instead. I set up some configurations that allow users to specify how much of the buffer to check at one time and where to start checking within the buffer. If no starting point is provided, my function cleverly checks different sections automatically—starting from the middle, then moving to the end.

To make sure we don't mistakenly start or end our checks in the middle of a UTF-8 character, I've added helper functions that adjust the beginning and end points of our inspection chunk to align with complete characters. These helpers look at the bytes and determine if they're starting or continuing bytes in a UTF-8 sequence, ensuring that our chunk boundaries are correctly placed. This method allows us to accurately figure out if the buffer is more likely to be text or binary, based on how well it conforms to UTF-8 standards.

## Getting Started

### Prerequisites
- Node.js
- npm

### How to run

2. `npm install`
3. `npm run dev` and play with the local dev environment.


## Author

**Nuzup Shadiev**

- Role: Frontend Software Engineer
- GitHub: https://github.com/nuzupshadiev
- LinkedIn: https://www.linkedin.com/in/nuzupshadiev/
- Email: nuzupshadiev@kaist.ac.kr



