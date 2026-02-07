# Deployment Guide: Agro360

This guide explains how to deploy **Agro360** using the "Easy" method:
-   **Frontend**: Vercel
-   **Backend**: Render

## Prerequisites
-   GitHub Account (Push your latest code to a repository)
-   Vercel Account
-   Render Account
-   Domain (Optional): `agro360.in`

---

## Part 1: Backend Deployment (Render)

1.  **Log in to Render** and click **"New +"** -> **"Web Service"**.
2.  **Connect your GitHub repository**.
3.  **Configure the Service**:
    -   **Name**: `agro360-backend`
    -   **Root Directory**: `backend` (Important!)
    -   **Environment**: `Python 3`
    -   **Build Command**: `pip install -r requirements.txt`
    -   **Start Command**: `gunicorn app:app` (This uses the Procfile we created)
    -   **Instance Type**: `Free`
4.  **Environment Variables** (Click "Advanced"):
    -   Add the variables from your `backend/.env` file:
        -   `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_PORT`
        -   `GEMINI_API_KEY`
        -   `SECRET_KEY`, `JWT_SECRET_KEY`
5.  **Click "Create Web Service"**.
6.  **Copy the URL**: Once deployed, copy your backend URL (e.g., `https://agro360-backend.onrender.com`).

---

## Part 2: Frontend Deployment (Vercel)

1.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
2.  **Import your GitHub repository**.
3.  **Configure Project**:
    -   **Framework Preset**: `Vite` (Should detect automatically)
    -   **Root Directory**: `frontend` (Click "Edit" next to Root Directory and select `frontend`).
4.  **Environment Variables**:
    -   Key: `VITE_API_URL`
    -   Value: Your Render Backend URL (e.g., `https://agro360-backend.onrender.com`)
    -   *Note: You might need to update your frontend code to use `import.meta.env.VITE_API_URL` instead of hardcoded `localhost:5001`.*
5.  **Deploy**: Click **"Deploy"**.
6.  **Custom Domain**:
    -   Go to **Settings** -> **Domains**.
    -   Add `agro360.in`.
    -   Follow instructions to update your DNS records (A record / CNAME) at your domain registrar.

---

## Part 3: Final Integration

1.  **Update Frontend API Calls**:
    -   Ensure your frontend API service (e.g., in `frontend/src/services/api.js` or similar) uses the environment variable.
    -   Example: `const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';`

2.  **Test**:
    -   Visit `agro360.in`.
    -   Try logging in or fetching data to verify frontend-backend connection.
