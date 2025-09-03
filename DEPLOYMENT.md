# Deployment Guide

## MongoDB Atlas Setup

1. **Get your connection string:**
   - Go to your MongoDB Atlas cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/medical_consultancy?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual database user password
   - Replace `medical_consultancy` with your preferred database name

## Environment Variables

Create a `.env` file in your project root with:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medical_consultancy?retryWrites=true&w=majority
PORT=3000
```

## Deploy to Vercel

### Option 1: Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Set environment variable: `vercel env add MONGODB_URI`

### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. In project settings → Environment Variables, add:
   - `MONGODB_URI` = your MongoDB Atlas connection string
4. Deploy

## Deploy to Render

1. Go to [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add environment variable:
   - **Key:** `MONGODB_URI`
   - **Value:** your MongoDB Atlas connection string
6. Deploy

## Important Notes

- Your app is now configured to use environment variables for the database connection
- CORS is enabled for cross-origin requests
- The app will work on both platforms with the same codebase
- Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) for deployment
