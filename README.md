# SYSLABO-tryout-program

# Organization Chart Generator

An automated organization chart generation application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for SYSLABO Corp.

## 🎯 Project Overview

This application automates the creation of organizational charts from employee and department data, replacing a manual Excel-based process. It handles concurrent positions (兼務/Kenmu) and maintains historical records of organizational changes.

### Key Features

- Automatic organization chart generation in a printable format
- Support for concurrent positions (兼務/Kenmu)
- Employee and department data management
- Change history tracking
- UTF-8 encoding support for Japanese characters

## 🚀 Requirements

### Core Requirements
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Optional Tools
- MongoDB Compass (for database management)
- Postman (for API testing)

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/organization-chart-generator.git
cd organization-chart-generator
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:
```bash
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/syslabo-org
JWT_SECRET=your_jwt_secret

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running the Application

1. Start MongoDB service
2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend application:
```bash
cd frontend
npm start
```

## 🏗️ Project Structure

```
organization-chart-generator/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## 📝 API Documentation

### Employee Endpoints
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `GET /api/employees/history` - Get employee history

### Department Endpoints
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `GET /api/departments/history` - Get department history

## 🗃️ Database Schema

### Employee (sys_users)
```javascript
{
  employeeId: String,
  name: String,
  department: String,
  position: String,
  concurrentPositions: [{
    departmentId: String,
    position: String,
    startDate: Date
  }],
  history: [{
    change: Object,
    timestamp: Date
  }]
}
```

### Department (cmn_department)
```javascript
{
  departmentId: String,
  name: String,
  parentDepartment: String,
  level: Number,
  history: [{
    change: Object,
    timestamp: Date
  }]
}
```

## 🔒 Security

- JWT authentication for API endpoints
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Environment variable protection

## 🌐 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution of this project's files, via any medium, is strictly prohibited.

## 📞 Contact

For questions and support, please contact: bgd_recruiting@syslabo.com

---

Copyright © SYSLABO All Rights Reserved.
