# NexusHR - Company Management System

Fullstack web app for managing company departments and employees with ASP.NET Core backend, React frontend, and SQL Server database.

---

## 🛠 Tech Stack

**Backend:** ASP.NET Core 10.0 | C# | SQL Server | xUnit  
**Frontend:** React 19 | TypeScript | Vite | Tailwind CSS | Vitest  
**Tools:** pnpm workspaces | Visual Studio 2022

---

## ✅ Prerequisites

- **.NET 10.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Visual Studio 2022** with ASP.NET workload or **VS Code** - [Download](https://visualstudio.microsoft.com/downloads/)
- **SQL Server LocalDB** (included with VS or [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads))
- **Node.js 18+** - [Download](https://nodejs.org)
- **pnpm 9.0.0+** - Install: `npm install -g pnpm@9`

---

## 🗄 Database Setup

1. **Start SQL Server LocalDB:**

   ```powershell
   sqllocaldb start MSSQLLocalDB
   ```

2. **Create the Database Manually (Optional)**

   If you prefer to create the database manually first, use SQL Server Management Studio (SSMS):
   - Open **SQL Server Management Studio**
   - Connect to: `(localdb)\MSSQLLocalDB`
   - Right-click **Databases** → **New Database**
   - Enter database name: `CompanyDB`
   - Click **OK**

3. **Execute the schema script** (`backend/DATABASE_SCHEMA.sql`):
   - **Option A (SQL Server Management Studio):** Open SSMS, connect to `(localdb)\MSSQLLocalDB`, open the SQL file, and run the script
   - **Option B (Command Line):**
     ```powershell
     sqlcmd -S (localdb)\MSSQLLocalDB -i backend\DATABASE_SCHEMA.sql
     ```

4. **Connection String Configuration**

   The connection string is configured in `backend/appsettings.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=CompanyDB;Trusted_Connection=True;TrustServerCertificate=True;"
     }
   }
   ```

   - **Server:** `(localdb)\MSSQLLocalDB` (LocalDB instance)
   - **Database:** `CompanyDB` (your database name)
   - **Trusted_Connection:** `True` (Windows authentication)
   - **TrustServerCertificate:** `True` (for development)

   If using a different SQL Server instance, update the `Server` value accordingly.

5. **Verify:** In SSMS or terminal, run:
   ```sql
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_CATALOG = 'CompanyDB';
   ```

---

## 🔧 Backend Setup

### Visual Studio 2022

1. Open `fullstack-assignment.sln`
2. Right-click `backend` → **Set as Startup Project**
3. Press **Ctrl + Shift + B** to build
4. Press **F5** to run
5. API available at: `https://localhost:5000`

### Terminal

```powershell
cd backend
dotnet run
```

---

## 🎨 Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Opens at: `http://localhost:5173`

---

## ▶️ Running the Project

### API Endpoints

```
GET    /api/department                # All departments
GET    /api/department/{id}           # Get department
POST   /api/department                # Create
PUT    /api/department/{id}           # Update
DELETE /api/department/{id}           # Delete

GET    /api/employee                  # All employees
GET    /api/employee/{id}             # Get employee
POST   /api/employee                  # Create
PUT    /api/employee/{id}             # Update
DELETE /api/employee/{id}             # Delete
```

---

## 🧪 Testing

### Backend Tests

```powershell
cd backend.Tests
dotnet test
```

Run all xUnit tests for backend API controllers and services.

### Frontend Tests

```bash
cd frontend
pnpm install           # Install dependencies first
pnpm test -- --run     # Run all tests once
pnpm test              # Run in watch mode
pnpm test:ui           # Interactive UI (browser)
pnpm test:coverage     # Generate coverage report
```

#### Test Coverage

| Test File                  | Tests   | Coverage                            |
| -------------------------- | ------- | ----------------------------------- |
| `edge-cases.test.ts`       | 21      | Edge cases & boundaries             |
| `utils.test.ts`            | 14      | Data transformations & calculations |
| `api.test.ts`              | 8       | API endpoints & error handling      |
| `dashboard.test.tsx`       | 6       | Dashboard component & stats         |
| `app.integration.test.tsx` | 5       | App routing & theme management      |
| **Total**                  | **54+** | **✅ All Passing**                  |

#### What's Tested

- ✅ **API Layer:** All department & employee endpoints (fetch, create, update, delete)
- ✅ **Components:** Dashboard rendering, data loading, navigation
- ✅ **Data:** Salary calculations, payroll breakdown, currency formatting
- ✅ **Features:** Dark mode toggle, theme persistence, error handling
- ✅ **Edge Cases:** Large datasets, empty data, null values, boundary conditions

## 🔍 Troubleshooting

| Problem                     | Solution                                                              |
| --------------------------- | --------------------------------------------------------------------- |
| LocalDB not found           | `sqllocaldb start MSSQLLocalDB`                                       |
| Database doesn't exist      | Re-run `DATABASE_SCHEMA.sql`                                          |
| Port 5000 in use            | Change port in `backend/Properties/launchSettings.json`               |
| CORS errors                 | Ensure backend running on `https://localhost:5000`                    |
| Module not found (frontend) | `pnpm install && pnpm dev`                                            |
| Tests fail                  | `dotnet restore backend.Tests` (backend) or `pnpm install` (frontend) |

---

## �‍💻 Developed By

**Gagana Methmal**

- 🌐 **Portfolio:** [iamgaganam.vercel.app](https://iamgaganam.vercel.app/)
- 💼 **LinkedIn:** [linkedin.com/in/gagana-methmal](https://www.linkedin.com/in/gagana-methmal/)
- 🐙 **GitHub:** [github.com/iamgaganam](https://github.com/iamgaganam)
- 📧 **Email:** [gaganam220@gmail.com](mailto:gaganam220@gmail.com)

---

## 📄 License

See [LICENSE](LICENSE) for details.
