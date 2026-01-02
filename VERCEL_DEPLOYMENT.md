# Vercel Deployment Instructions

## Step 1: Push to GitHub
```bash
git remote add origin https://github.com/Abdessalem2000/task-manager-frontend.git
git push -u origin master
```

## Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `task-manager-frontend`
4. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `.`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 3: Set Environment Variable
In Vercel dashboard, add:
- **Variable Name**: `VITE_API_URL`
- **Value**: `https://task-manager-api-x8q7.onrender.com`
- **Environment**: Production, Preview, Development

## Step 4: Deploy
Click "Deploy" and wait for deployment to complete.

## Step 5: Test
After deployment, test:
- Add a new task
- Delete a task
- Verify toast notifications
- Check on mobile browser

Your app will be live at: `https://your-app-name.vercel.app`
