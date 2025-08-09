
# SYSLABO Organization Chart Management System

## 組織図自動出力アプリ / Organization Chart Automatic Output Application

A comprehensive web application developed for SYSLABO Corp. to automate the generation of organizational charts and manage company structure data efficiently.

[Task Specification](https://github.com/azraihan/SYSLABO-tryout-program/blob/main/TASK_an%20organization%20chart%20automatic%20output%20application.pdf)

![SYSLABO Logo](frontend/public/syslabo_logo.png)

## 📋 Project Overview

This application addresses SYSLABO's need to modernize their manual Excel-based organizational chart creation process. The system provides:

- **Automated Organization Chart Generation**: Replace manual Excel chart creation with dynamic, interactive visualizations
- **Data Management**: Centralized management of employee and department information
- **Change History Tracking**: Complete audit trail of all organizational changes
- **PDF Export**: Professional, printable organizational charts with Japanese language support
- **Concurrent Duties Support**: Framework for managing employees with multiple positions (兼務/Kenmu)

## 🏗️ System Architecture

### Backend (Node.js/Express)
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful endpoints for CRUD operations
- **Logging**: Comprehensive change tracking system
- **Models**: Department, Personnel, and LogTable schemas

### Frontend (React)
- **UI Framework**: Material-UI components
- **Visualization**: GoJS for interactive organizational charts
- **PDF Generation**: jsPDF with Japanese font support
- **Responsive Design**: Mobile-friendly interface

## 🚀 Features

### Core Functionality

1. **Organization Chart Visualization**
   - Interactive, zoomable hierarchical chart
   - Expandable department nodes showing members
   - Real-time updates from database

2. **Department Management**
   - Add, edit, delete departments
   - Hierarchical parent-child relationships
   - Department head assignment
   - Member management

3. **Personnel Management**
   - Employee information maintenance
   - Department assignment
   - Status tracking (member/department head)

4. **PDF Export**
   - Professional organizational chart export
   - Japanese language support (UTF-8 encoding)
   - Company branding with logo
   - Date stamping in both Japanese and English formats

5. **Change History Logging**
   - Complete audit trail of all changes
   - Timestamp tracking
   - Action descriptions

### Advanced Features

6. **Concurrent Duties Framework** (兼務 Support)
   - Database schema designed to support multiple department assignments
   - Extensible model for future implementation

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd organization-chart-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the backend directory:
   ```
   ATLAS_URI=mongodb://localhost:27017/syslabo_org_chart
   PORT=5000
   ```
   
   For MongoDB Atlas (cloud):
   ```
   ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/syslabo_org_chart
   PORT=5000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Database Configuration

The application uses MongoDB as its database. You can use either:

- **Local MongoDB**: Install MongoDB Community Edition
- **MongoDB Atlas**: Free cloud database service
- **Docker MongoDB**: Run MongoDB in a container

### Font Setup for PDF Export

The application includes Japanese font support for PDF generation. The Noto Sans JP fonts should be placed in:
```
frontend/public/fonts/Noto_Sans_JP/
├── NotoSansJP-VariableFont_wght.ttf
└── static/
    └── NotoSansJP-Bold.ttf
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:5000

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```
   Application will open at http://localhost:3000

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve the application**
   Configure your web server to serve the built files and proxy API requests to the backend.

## 📚 Usage Guide

### Accessing the Application

1. **Navigation**: Use the sidebar menu or top navigation to access different sections
2. **Department Management**: Add, edit, or delete departments with hierarchical relationships
3. **Personnel Management**: Manage employee information and department assignments
4. **Organization Chart**: View and interact with the visual organizational structure
5. **PDF Export**: Generate professional organizational charts for printing or sharing
6. **Logs**: Review all system changes and modifications

### Department Management

- **Add Department**: Click the add button and fill in department details
- **Edit Department**: Use the edit icon to modify department information
- **Delete Department**: Remove departments (child departments will be updated automatically)
- **Hierarchy**: Set parent departments to create organizational structure

### Personnel Management

- **Add Personnel**: Add new employees and assign them to departments
- **Edit Personnel**: Update employee information and department assignments
- **Department Assignment**: Use dropdown menus to assign employees to departments

### Organization Chart Features

- **Zoom**: Use mouse wheel or zoom controls
- **Pan**: Click and drag to move around the chart
- **Expand Nodes**: Click expand buttons to view department members
- **PDF Export**: Click "Export as PDF" for printable version

## 🗄️ Database Schema

### Department Collection
```javascript
{
  id: String,           // Unique department ID
  sys_id: String,       // System ID
  name: String,         // Department name
  parentName: String,   // Parent department name
  parent: String,       // Parent department ID
  department_head: String,  // Department head name
  description: String,  // Department description
  primary_contact: String,  // Primary contact
  members: [String],    // Array of member names
  expanded: Boolean     // UI state for chart expansion
}
```

### Personnel Collection
```javascript
{
  name: String,         // Employee name
  department: String,   // Department name
  status: String        // "member" or "department_head"
}
```

### LogTable Collection
```javascript
{
  action: String,       // Description of the action performed
  time: Date           // Timestamp of the action
}
```

## 🔧 API Endpoints

### Department Endpoints
- `GET /department` - Retrieve all departments
- `POST /department/add` - Add new department
- `PUT /department/update/:id` - Update department
- `DELETE /department/delete/:id` - Delete department
- `GET /department/department-names` - Get all department names
- `GET /department/id` - Get department ID by name

### Personnel Endpoints
- `GET /personnel` - Retrieve all personnel
- `POST /personnel/add` - Add new personnel
- `PUT /personnel/update/:id` - Update personnel
- `DELETE /personnel/delete/:id` - Delete personnel

### Log Endpoints
- `GET /user/logs` - Retrieve all system logs

## 🌐 Internationalization

The application supports both Japanese and English:
- **Japanese Data**: Full UTF-8 support for Japanese characters
- **PDF Export**: Japanese fonts included for proper rendering
- **Date Formats**: Both Japanese and English date formats in exports
- **Interface**: Bilingual labels and descriptions

## 🔒 Security Considerations

- **Input Validation**: All user inputs are validated
- **Database Security**: Use MongoDB security best practices
- **Environment Variables**: Sensitive configuration in .env files
- **CORS**: Configured for secure cross-origin requests

## 🤝 Contributing

This project was developed as part of SYSLABO's internship program. For contributions:

1. Follow the existing code structure and naming conventions
2. Ensure Japanese language support is maintained
3. Test all functionality before submitting changes
4. Document any new features or API changes

## 📄 License

This project is proprietary software developed for SYSLABO Corp. All rights reserved.


## 🎯 Future Enhancements

### Concurrent Duties Implementation (兼務)
The database schema is prepared to support employees with multiple department assignments. Future implementation could include:

- Extended Personnel model to support multiple department relationships
- UI updates to display and manage concurrent duties
- Enhanced organizational chart visualization for shared employees
- Reporting features for concurrent duty analysis

### Additional Features
- **User Authentication**: Role-based access control
- **Data Export**: CSV/Excel export functionality
- **Backup System**: Automated database backups
- **Email Notifications**: Change notifications to stakeholders
- **Mobile App**: Native mobile application for chart viewing

---

**Development Period**: 3 weeks (Internship Project)  
**Technology Stack**: Node.js, Express, MongoDB, React, Material-UI, GoJS  
**Language Support**: Japanese (UTF-8) and English
