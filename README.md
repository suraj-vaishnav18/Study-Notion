# StudyNotion 📚

A full stack EdTech platform where students can enroll in courses 
and instructors can create and manage courses.



## ✨ Features

### Student
- Browse and enroll in courses
- Secure login and registration
- Manage profile and enrolled courses
- Add courses to cart and checkout

### Instructor
- Create and publish courses
- Manage course content
- Track enrolled students

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Redux Toolkit (auth, cart, profile, course slices)
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB

**Other:**
- JWT Authentication
- Protected Routes
- Role-based access (Student & Instructor)

## ⚙️ Installation & Setup

1. Clone the repository
```bash
git clone https://github.com/suraj-vaishnav18/Study-Notion
```

2. Install frontend dependencies
```bash
cd src
npm install
```

3. Install backend dependencies
```bash
cd SERVER
npm install
```

4. Create `.env` file in SERVER folder
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

5. Run the backend
```bash
cd SERVER
npm start
```

6. Run the frontend
```bash
cd src
npm start
```

7. Open in browser
http://localhost:3000


## 📬 Contact
- GitHub: [@suraj-vaishnav18](https://github.com/suraj-vaishnav18)
- Email: surajvaishnav2677@gmail.com
