# Interview Experience Hub 🎯

A full-stack web application where users can share and explore real-world interview experiences to help job seekers prepare better for their interviews.

## 🌟 Features

### Core Functionality
- **Browse Experiences**: View interview experiences with company logos, search, and filter functionality
- **Share Experiences**: 2-step form to submit detailed interview experiences
- **Search & Filter**: Filter by company, role, location, difficulty, and sort by latest/popular
- **Upvoting System**: Users can upvote helpful interview experiences
- **Responsive Design**: Mobile-friendly interface with Bootstrap styling

### Interview Details Captured
- Company and role information
- Offer status and location
- Number of rounds and coding problems
- Difficulty level and interview mode (Remote/Onsite)
- Personal details (name, education, experience level)
- Auto-generated tags based on experience level

## 🛠️ Tech Stack

### Frontend
- **Angular 20.3.0**: Modern TypeScript framework
- **Bootstrap 5.3.8**: Responsive CSS framework
- **Font Awesome 6.4.0**: Icon library
- **SCSS**: Enhanced CSS with variables and nesting

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB

## 📁 Project Structure

```
interview-experience-hub/
├── src/app/                    # Angular Frontend
│   ├── components/
│   │   ├── home/              # Homepage with search & filtering
│   │   ├── submit-experience/ # 2-step experience submission form
│   │   └── experience-list/   # Experience display component
│   ├── services/
│   │   └── experience.service.ts # API communication service
│   └── ...
├── backend/                   # Node.js Backend
│   ├── models/
│   │   └── Experience.js      # MongoDB schema
│   ├── routes/
│   │   └── experiences.js     # API endpoints
│   ├── server.js             # Express server setup
│   └── package.json
└── public/assets/logos/       # Company logo assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interview-experience-hub
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure Environment**
   ```bash
   # In backend/.env
   MONGODB_URI=mongodb://localhost:27017/interview-experience-hub
   PORT=3000
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in backend/.env
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:3000
   ```

3. **Start Frontend Application**
   ```bash
   # In project root
   ng serve
   # Application runs on http://localhost:4200
   ```

## 📊 API Endpoints

### Experiences
- `GET /api/experiences` - Retrieve all experiences with filtering
- `GET /api/experiences/:id` - Get single experience
- `POST /api/experiences` - Create new experience
- `PUT /api/experiences/:id/upvote` - Upvote an experience
- `GET /api/experiences/companies/popular` - Get popular companies

### Query Parameters (GET /api/experiences)
- `company` - Filter by company name
- `role` - Filter by role
- `location` - Filter by location
- `difficulty` - Filter by difficulty (Easy/Medium/Hard)
- `sortBy` - Sort by 'latest' or 'popular'
- `page` - Page number for pagination
- `limit` - Number of results per page

## 🎨 Key Components

### Homepage (`/`)
- Company logo grid with click-to-filter
- Advanced search and filter panel
- Paginated experience list
- Real-time search results

### Submit Experience (`/submit`)
- **Step 1**: Interview details (company, role, rounds, difficulty)
- **Step 2**: Personal details (education, experience level)
- Form validation and submission feedback
- Automatic tagging based on user profile

### Experience Cards
- Company and role prominently displayed
- Difficulty and offer status badges
- Interview statistics (rounds, coding problems)
- Applicant background information
- Upvote functionality
- Responsive design for mobile

## 🔧 Development

### Adding New Features
1. **Frontend**: Create components in `src/app/components/`
2. **Backend**: Add routes in `backend/routes/`
3. **Database**: Modify schemas in `backend/models/`

### Testing
```bash
# Frontend tests
ng test

# Backend tests (if implemented)
cd backend
npm test
```

### Building for Production
```bash
# Frontend build
ng build --prod

# Backend (already production-ready)
cd backend
npm start
```

## 🌐 Deployment

### Frontend (Netlify/Vercel)
```bash
ng build --prod
# Deploy dist/ folder
```

### Backend (Heroku/DigitalOcean)
```bash
cd backend
# Set environment variables
# Deploy with your preferred platform
```

### Database (MongoDB Atlas)
- Create MongoDB Atlas cluster
- Update MONGODB_URI in environment variables
- Ensure network access is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] User authentication and profiles
- [ ] Comments system for experiences
- [ ] Advanced analytics dashboard
- [ ] Email notifications for new experiences
- [ ] Interview preparation resources
- [ ] Company-wise statistics
- [ ] Export functionality (PDF/Excel)
- [ ] Mobile app development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bootstrap for responsive design components
- Font Awesome for beautiful icons
- MongoDB for flexible data storage
- Angular community for excellent documentation

---

**Built with ❤️ for the developer community**

For support or questions, please open an issue in the repository.