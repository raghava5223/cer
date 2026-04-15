# Deployment Guide: College Event Registration Portal

Follow these steps to deploy your MERN stack application for free.

## 🚀 One-Click Deploy (After Pushing to GitHub)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/raghava5223/cer)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https://github.com/raghava5223/cer)

---

## 1. Database Setup (MongoDB Atlas)

1. Sign up/Login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Shared Cluster** (Free).
3. **Database Access**: Create a database user with a username and a strong password. Note these down.
4. **Network Access**: Add IP Address `0.0.0.0/0` (Allow access from anywhere) to allow Render/Vercel to connect.
5. **Connection String**: Click "Connect" -> "Drivers" -> Choose Node.js. Copy the connection string.
   - It should look like: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - Replace `<password>` with your actual password.

---

## 2. Push Code to GitHub

1. Create a new repository on [GitHub](https://github.com).
2. Open your terminal in the root folder of your project.
3. Run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

---

## 3. Deploy Backend (Render)

1. Sign up/Login to [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `college-event-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Environment Variables**: Click "Advanced" or "Environment" and add:
   - `MONGO_URI`: (Your MongoDB Atlas string)
   - `JWT_SECRET`: (Any secure long string)
   - `FRONTEND_URL`: (Wait until you deploy the frontend, then update this)
   - `GEMINI_API_KEY`: (Your key)
   - `PINECONE_API_KEY`: (Your key)
   - `PINECONE_INDEX`: (Your index name)
   - `EMAIL_USER`: (Your email)
   - `EMAIL_PASS`: (Your App Password)
6. Click **Create Web Service**. Note the URL (e.g., `https://xxxx.onrender.com`).

---

## 4. Deploy Frontend (Vercel)

1. Sign up/Login to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite` (should be auto-detected)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api` (Replace with your actual Render URL)
6. Click **Deploy**. Note your Frontend URL.

---

## 5. Final Step: Connect Them

1. Go back to your **Render** dashboard.
2. Edit your Backend's **Environment Variables**.
3. Update `FRONTEND_URL` with your actual Vercel URL (e.g., `https://your-app.vercel.app`).
4. Save changes. Render will redeploy.

---

## Common Troubleshooting

- **CORS Error**: Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash).
- **500 Error**: Check Render logs for details. Usually a missing environment variable or wrong MongoDB password.
- **API not connecting**: Ensure `VITE_API_URL` in Vercel ends with `/api`.
- **Cold Start**: Render's free tier sleeps after 15 minutes of inactivity. The first request might take 30-60 seconds to wake up the server.
