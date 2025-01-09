# SYSLABO-tryout-program

# Organization Chart Generator

A MERN stack application for automatically generating and managing organizational charts with support for concurrent positions (兼務/Kenmu).

## Overview

This application solves the challenge of manually maintaining organizational charts in Excel by providing an automated solution with the following features:

- Automatic generation of organizational charts from employee and department data
- Support for concurrent positions (兼務/Kenmu)
- Change history tracking
- Simple maintenance interface for employee and department data
- UTF-8 support for Japanese text

## Technologies

- MongoDB (Database)
- Express.js (Backend)
- React.js (Frontend)
- Node.js (Runtime)
- Additional libraries:
  - Mermaid.js (Chart visualization)
  - Material-UI (UI components)
  - Mongoose (MongoDB ODM)

## Features

### Core Features

1. **Automated Chart Generation**
   - Generates printable organizational charts
   - Supports hierarchical department structures
   - Indicates concurrent positions with (兼) symbol

2. **Data Management**
   - Employee (sys_users) management
   - Department (cmn_department) management
   - Change history tracking
   - Support for concurrent position management

3. **User Interface**
   - Intuitive maintenance interface
   - Print-ready chart output
   - UTF-8 support for Japanese text

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies for backend
cd backend
npm install

# Install dependencies for frontend
cd ../frontend
npm install

# Create .env file in backend directory
cp .env.example .env
```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
```

## Database Schema

### sys_users
```javascript
{
  userId: String,
  name: String,
  department: String,
  position: String,
  concurrent_positions: [{
    department: String,
    position: String,
    startDate: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### cmn_department
```javascript
{
  departmentId: String,
  name: String,
  parentDepartment: String,
  level: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Access the application at `http://localhost:3000`

## Development Guidelines

1. **Code Style**
   - Follow ESLint configuration
   - Use Prettier for formatting
   - Write meaningful commit messages

2. **Database Changes**
   - Add new fields instead of modifying existing ones
   - Maintain change history
   - Document schema changes

3. **Testing**
   - Write unit tests for new features
   - Ensure UTF-8 compatibility
   - Test concurrent position scenarios

## API Documentation

### Employee Endpoints

```
GET /api/employees - List all employees
POST /api/employees - Create new employee
PUT /api/employees/:id - Update employee
GET /api/employees/:id/history - Get employee history
```

### Department Endpoints

```
GET /api/departments - List all departments
POST /api/departments - Create new department
PUT /api/departments/:id - Update department
GET /api/departments/:id/history - Get department history
```

### Chart Endpoints

```
GET /api/chart - Generate organizational chart
GET /api/chart/export - Export chart as PDF
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. All rights reserved by SYSLABO Corp.

## Support

For questions and support, please contact:
- Email: bgd_recruiting@syslabo.com

## Acknowledgments

- SYSLABO Corp. for the project requirements and specifications
- All contributors and maintainers of the project
