# DOT IT. - Modern Task Management System (MERN)

A robust, production-ready Task Management application built with the MERN stack, featuring unified authentication, real-time email notifications, and cloud-based file storage.

## 🚀 Key Features

- **Unified Authentication**: A single login portal for Admin, Project Managers, and Employees with role-based dashboard redirection.
- **Task Management**: Admins and PMs can create, assign, update, and track tasks.
- **Rich File Attachments**: Gmail-style file preview and download for tasks, powered by **Cloudinary** for persistent storage.
- **Email Notifications**: Automatic email alerts (Nodemailer + Gmail App Passwords) for task assignments and status updates.
- **Advanced Profile Management**: Users can update their profile information, view their roles, and securely change their passwords.
- **Modern UI**: Sleek, responsive design built with React, Tailwind CSS, and Lucide-React icons.
- **Production Optimized Backend**:
  - **Security**: Helmet.js for HTTP headers protection.
  - **Performance**: MongoDB connection pooling and dynamic CORS management.
  - **State Persistence**: Secure environment-aware JWT cookies.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios, React Hot Toast.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Cloud Storage**: Cloudinary (via Multer-Storage-Cloudinary).
- **Email**: Nodemailer (SMTP with Gmail).
- **Security**: JSON Web Tokens (JWT), BcryptJS, Helmet.

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd task-management-mern
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=http://localhost:5173
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Run Backend**:
   ```bash
   cd ../backend
   npm run dev
   ```

## 📂 Project Structure

- `/frontend`: React application (Pages, Components, Context, API).
- `/backend`: Express API (Models, Controllers, Routes, Middleware, Config).
- `/uploads`: Temporary local storage (Deprecated in favor of Cloudinary).

## 📄 License
This project is licensed under the ISC License.
