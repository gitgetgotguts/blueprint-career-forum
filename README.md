# FEEE - Forum ENET'COM Entreprise Étudiant

<div align="center">
  <img src="public/logo-free.png" alt="FEEE Logo" width="200" />
  
  **A modern career forum platform connecting engineering students with companies**
  
  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)](https://supabase.com)
</div>

---

## 📋 About

FEEE (Forum ENET'COM Entreprise Étudiant) is a full-stack web application built for ENET'COM engineering school's annual career forum. The platform facilitates connections between students seeking internships (Stage/PFE) or jobs and partner companies.

### ✨ Key Features

- **Three User Roles**: Admin, Company, and Student dashboards
- **Job Offer Management**: Companies post offers, admins moderate, students apply
- **Real-time Analytics**: Live statistics and engagement metrics
- **Student Portfolios**: Students showcase projects with thumbnails and links
- **Application Workflow**: Complete flow from posting to hiring with feedback
- **Email Notifications**: Automated welcome emails via EmailJS
- **Editions Gallery**: A wayback machine showcasing photos from past editions
- **Blueprint Theme**: Professional engineering-inspired design

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Email** | EmailJS |
| **State** | React Context, TanStack Query |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A [Supabase](https://supabase.com) account
- An [EmailJS](https://www.emailjs.com) account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/blueprint-career-forum.git
   cd blueprint-career-forum
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

4. **Set up Supabase**
   
   - Create a new Supabase project
   - Run the database migrations (SQL files in `/supabase` if available)
   - Configure Row Level Security (RLS) policies
   - Set up storage buckets for CVs and images

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open in browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

---

## 📁 Project Structure

```
blueprint-career-forum/
├── public/              # Static assets (logos, images)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── illustrations/
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and Supabase client
│   ├── pages/           # Page components
│   │   ├── Index.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── CompanyDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── Presentation.tsx
│   └── test/            # Test files
├── .env.local           # Environment variables (create this)
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## 👥 User Roles

### 🔴 Admin
- Create and manage user accounts (students & companies)
- Moderate job offers (approve/reject with feedback)
- View real-time analytics and statistics
- Monitor platform activity

### �� Company
- Post job offers (Stage, PFE, Employment)
- Track offer approval status
- Review student applications
- Accept/reject candidates with required feedback
- View student profiles and portfolios

### 🔵 Student
- Browse approved job offers
- Apply with CV upload and cover letter
- Track application status
- Build profile with career goals and portfolio projects

---

## 🎨 Theme

The platform uses a **Blueprint** theme inspired by engineering drawings:
- Dark blue background with cyan accents
- Grid pattern backgrounds
- Technical typography
- Professional and modern aesthetic

---

## 📄 License

This project was built for ENET'COM engineering school.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <strong>Built with ❤️ for ENET'COM</strong>
</div>
