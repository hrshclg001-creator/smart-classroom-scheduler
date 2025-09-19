# 📘 Smart Classroom & Timetable Scheduler  

A full-stack web application for managing classrooms, timetables, and scheduling efficiently.  
Built with **Node.js**, **Express**, **MongoDB Atlas**, and **React**.  

---

## 🚀 Project Setup  

### Step 1: Set up the Project Structure  
```bash
mkdir smart-classroom-scheduler
cd smart-classroom-scheduler
mkdir backend frontend
```

---

### Step 2: Initialize Backend  
Navigate into the backend folder, initialize a Node.js project, and install required dependencies.  

```bash
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv express-validator
```

Create the following folders:  
- `models`  
- `routes`  
- `middleware`  
- `controllers`  

Place the backend code into these respective files.  

---

### Step 3: Configure Backend Environment  
Create a `.env` file inside the `backend` folder.  

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_strong_and_random_jwt_secret_key
PORT=5000
```

Replace the placeholder values with your actual MongoDB Atlas connection string and a strong secret key.  

---

### Step 4: Initialize Frontend  
Navigate into the frontend directory and set up React.  

```bash
cd ..
cd frontend
npx create-react-app .
npm install axios react-router-dom
```

Create subfolders inside `src`:  
- `components`  
- `context`  
- `pages`  

Place the frontend code into these folders.  

---

### Step 5: Configure Frontend Environment  
Create a `.env` file inside the `frontend` folder.  

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Update `frontend/package.json` to add a proxy:  

```json
"proxy": "http://localhost:5000"
```

This ensures API requests are redirected to the backend.  

---

### Step 6: Connect to MongoDB Atlas  

1. **Create MongoDB Atlas Account** → [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
2. **Create a Cluster** → Use **M0 Free Tier**.  
3. **Create Database User** → Set a username and password.  
4. **Whitelist Your IP** → Add your local IP address.  
5. **Get Connection String** → Example:  
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/smart_classroom_db?retryWrites=true&w=majority
   ```
6. **Update Backend `.env` file**:  
   ```env
   MONGODB_URI=mongodb+srv://<your_username>:<your_password>@<cluster_name>.mongodb.net/smart_classroom_db?retryWrites=true&w=majority
   JWT_SECRET=your_super_strong_and_random_jwt_secret_key
   PORT=5000
   ```

---

### Step 7: Run the Application  

#### Option A: Run Separately (Recommended for debugging)  
- Backend:  
  ```bash
  cd backend
  npm start
  ```
- Frontend:  
  ```bash
  cd frontend
  npm start
  ```

#### Option B: Run Simultaneously (Efficient)  
From the root project folder:  

```bash
npm init -y
npm install concurrently
```

Update the root `package.json`:  

```json
"scripts": {
  "start": "concurrently \"npm start --prefix backend\" \"npm start --prefix frontend\""
}
```

Now run:  
```bash
npm start
```

---

## 🌐 Access the Application  
Open your browser at:  
👉 [http://localhost:3000](http://localhost:3000)  

You can now register an admin user and start managing classrooms, schedules, and timetables.  

---

## ⚙️ Tech Stack  

- **Frontend**: React, Axios, React Router DOM  
- **Backend**: Node.js, Express, Mongoose  
- **Database**: MongoDB Atlas  
- **Authentication**: JWT & bcryptjs  
- **Environment Management**: dotenv  
- **Utilities**: express-validator, cors  

---

## 📌 Notes  
- Ensure MongoDB Atlas is configured correctly.  
- Always keep your `.env` files secure and **never push them to GitHub**.  
