# PayRemind – Payment Reminder System

A full-stack payment reminder dashboard built for the Binary Automates Software Engineering Internship assignment.

## Features

- Create and manage invoices
- Delete invoices
- Track payment status
- Auto-detect overdue invoices
- Search by customer, email, or invoice ID
- Filter invoices by status
- Send real payment reminder emails
- Track reminder activity
- Dashboard summary cards
- Responsive UI
- Local storage persistence

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Lucide React Icons

### Backend
- Node.js
- Express.js
- Nodemailer

## Project Structure

```bash
payment-reminder-system/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

## How to Run Locally

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_LINK
```

Example:

```bash
git clone https://github.com/your-username/payment-reminder-system.git
```

### 2. Go Inside the Project Folder

```bash
cd payment-reminder-system
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```bash
http://localhost:5173
```

## Backend Setup

Open a second terminal from the root folder:

```bash
cd backend
npm install
npm run dev
```

Backend will run at:

```bash
http://localhost:5000
```

## Email Setup

To enable real email reminders, create a `.env` file inside the `backend` folder.

```env
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

### How to Get Gmail App Password

1. Enable 2-Step Verification on your Google account.
2. Go to Google App Passwords.
3. Create a new app password for this project.
4. Copy the 16-character password.
5. Paste it in `backend/.env` as `EMAIL_PASS`.

Do not use your normal Gmail password.

## Important Notes

- Keep both frontend and backend terminals running.
- The frontend runs on port `5173`.
- The backend runs on port `5000`.
- The `.env` file is ignored from GitHub for security.
- Invoices are stored using browser local storage.

## Main Workflow

1. Create an invoice.
2. View it in the dashboard table.
3. Search or filter invoices.
4. Send a reminder email.
5. Mark invoice as paid.
6. Delete invoice if needed.

## Future Improvements

- User authentication
- Database integration
- PDF invoice generation
- Scheduled reminders
- Deployment
- Analytics charts

## Assignment Objective

This project demonstrates invoice tracking, payment status management, real email reminders, search/filtering, dashboard summaries, and responsive UI design for a small business payment reminder workflow.

## UI Note

The sidebar navigation is currently implemented as part of the dashboard UI layout and design system.  
Core functionality such as invoice management, reminder emails, dashboard analytics, search/filtering, and payment status tracking is fully functional.

The sidebar items are currently non-navigational placeholders intended for future expansion.