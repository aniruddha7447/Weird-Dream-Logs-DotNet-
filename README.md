# 🌙 Weird Dream Logs — Full‑Stack (.NET + React) 👵🏼

A full‑stack web app to **log, reflect on, and explore dreams**. Users can write private journals or share public entries, follow other dreamers, and comment on posts — backed by a secure ASP.NET Core API and a React frontend.

> **Repo:** `aniruddha7447/Weird-Dream-Logs-DotNet-`  
> **Stack:** ASP.NET Core 8, Entity Framework Core, SQL Server, React, Axios

---

## ✨ Features

- **JWT Authentication**: Sign up / login, protected routes
- **Dream CRUD**: Create, read, update, delete dream entries; tag/categorize
- **Privacy Controls**: Public vs private dreams
- **Social**: Follow users and view their public dreams in a feed
- **Comments**: Discuss and react to dreams
- **RESTful API**: Clean endpoints for all entities

---

## 🗂️ Project Structure

> Structure derived from the repository folders (`WeirdDreamLogs` for backend, `weird_dream_logs` for frontend).  
> Adjust names if your local folder names differ.

```
Weird-Dream-Logs-DotNet-/
├─ README.md
├─ WeirdDreamLogs/                 # ASP.NET Core 8 Web API (C#)
│  ├─ Controllers/                 # AuthController, DreamsController, CommentsController, FollowsController, etc.
│  ├─ Models/                      # Entity classes (User, Dream, Comment, Follow, Tag, etc.)
│  ├─ Data/                        # DbContext, Seeders
│  ├─ DTOs/                        # Request/response payloads to decouple API from models
│  ├─ Services/                    # Auth/JWT, User, Dream, Comment, Follow services
│  ├─ Middleware/                  # Exception handling, JWT middleware (if custom)
│  ├─ Migrations/                  # EF Core migrations
│  ├─ Properties/
│  ├─ appsettings.json             # Local configuration
│  ├─ Program.cs                   # Bootstraps the app
│  └─ WeirdDreamLogs.csproj
└─ weird_dream_logs/               # React frontend (JavaScript)
   ├─ public/
   └─ src/
      ├─ components/               # Reusable UI (DreamCard, DreamForm, Navbar, etc.)
      ├─ pages/                    # Route pages (Login, Register, Feed, MyDreams, DreamDetail)
      ├─ hooks/                    # Custom hooks (useAuth, useFetch, etc.)
      ├─ services/                 # API client (axios), auth helpers
      ├─ context/                  # AuthContext / Global state
      ├─ router/                   # Routes configuration
      ├─ styles/                   # CSS modules / global styles
      ├─ main.jsx                  # App entry
      └─ App.jsx
```

---

## 🏗️ Architecture at a Glance

```
[ React (Vite/CRA) ]  --->  [ ASP.NET Core 8 API ]  --->  [ SQL Server ]
       Axios                    Controllers + Services          EF Core
       JWT in storage           JWT Auth / Authorization        Migrations
```

---

## ⚙️ Backend Setup (ASP.NET Core 8)

1. **Configure environment**
   - Install [.NET 8 SDK](https://dotnet.microsoft.com/download)
   - Install SQL Server (or use a container)

2. **Set secrets / environment variables**
   - `ConnectionStrings__DefaultConnection` — SQL Server connection string  
     e.g. `Server=localhost;Database=WeirdDreamLogs;Trusted_Connection=True;TrustServerCertificate=True;`
   - `Jwt__Issuer` — token issuer (e.g. `WeirdDreamLogs`)
   - `Jwt__Audience` — token audience (e.g. `WeirdDreamLogs.Client`)
   - `Jwt__Key` — **strong secret key** for signing tokens

3. **Apply migrations & run**
   ```bash
   cd WeirdDreamLogs
   dotnet restore
   dotnet ef database update   # if EF tools configured
   dotnet run
   ```
   > The API will start on the HTTP/HTTPS ports configured in `launchSettings.json`.

---

## 🖥️ Frontend Setup (React)

1. **Install Node.js** (LTS recommended)
2. **Install & run**
   ```bash
   cd weird_dream_logs
   npm install
   npm run dev    # or npm start depending on the setup
   ```
3. **Environment** (create `.env` in frontend root):
   ```ini
   VITE_API_BASE_URL=http://localhost:PORT/api   # match backend port
   ```

---

## 🔐 Authentication Flow

- **Register** → `/api/auth/register`
- **Login** → `/api/auth/login` returns **JWT**
- Store token (e.g., localStorage). Include it on requests:
  - Header: `Authorization: Bearer <token>`
- Protected endpoints validate JWT & user roles/claims if defined.

---

## 📚 Core API (Representative Endpoints)

> Path prefixes may vary; adjust to your actual controller routes.

```http
POST   /api/auth/register
POST   /api/auth/login

GET    /api/dreams                # list public or authorized user’s feed
POST   /api/dreams                # create dream (auth)
GET    /api/dreams/{id}
PUT    /api/dreams/{id}           # update (owner only)
DELETE /api/dreams/{id}           # delete (owner only)

GET    /api/users/{id}/dreams     # user profile dreams
POST   /api/follow/{userId}       # follow a user (auth)
DELETE /api/follow/{userId}       # unfollow (auth)

GET    /api/dreams/{id}/comments
POST   /api/dreams/{id}/comments  # add comment (auth)
DELETE /api/comments/{id}         # delete own comment/admin
```

---

## 🧪 Testing Tips

- Use **Postman** or **REST Client** to validate endpoints
- For frontend, test flows: register → login → create dream → set privacy → follow → comment
- Seed a few users/dreams for demo (optional Seeder in `Data/`)

---

## 🛡️ Security & Best Practices

- Always use **HTTPS** in production
- Store **JWT** securely; consider **httpOnly cookies** if feasible
- Validate ownership on update/delete
- Use DTOs to prevent over-posting
- Enable CORS for the frontend origin only
- Handle errors centrally (Exception middleware)

---

## 🚀 Scripts & Commands

```bash
# Backend
dotnet build
dotnet ef migrations add <Name>
dotnet ef database update
dotnet run

# Frontend
npm install
npm run dev / build
```

---

## 📦 Deployment Notes

- **Backend**: Deploy to Azure App Service / any .NET host; set environment variables and connection string
- **Database**: Azure SQL / on‑prem SQL Server
- **Frontend**: Build static assets and serve via any host (Netlify, Vercel, Nginx)

---

## 🗒️ License

MIT (or your preferred license).

---

## 🙌 Acknowledgements

- Built by **Aniruddha Shivaji Lalge**
- Thanks to the .NET & React communities
