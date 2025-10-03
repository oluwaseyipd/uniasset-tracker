# Environment Configuration

This document explains how to configure environment variables for the UniAsset Tracker application.

## Environment Variables

The application requires the following environment variables to be set in your `.env` file:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://yourproject.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable (anon) key | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID | `yourprojectid123` |

## Setting Up Environment Variables

### 1. Create a .env file

Create a `.env` file in the root directory of your project:

```bash
touch .env
```

### 2. Add your variables

Add your Supabase credentials to the `.env` file **without quotes**:

```env
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=yourprojectid123
```

### 3. Getting your Supabase credentials

You can find these values in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** > **API**
4. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys** > **anon public** → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Project Reference ID** → `VITE_SUPABASE_PROJECT_ID`

## Important Notes

### ❌ Don't use quotes

**Incorrect:**
```env
VITE_SUPABASE_URL="https://yourproject.supabase.co"
```

**Correct:**
```env
VITE_SUPABASE_URL=https://yourproject.supabase.co
```

### ❌ Don't include extra whitespace

**Incorrect:**
```env
VITE_SUPABASE_URL= https://yourproject.supabase.co 
```

**Correct:**
```env
VITE_SUPABASE_URL=https://yourproject.supabase.co
```

### ✅ Keep your .env file secure

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Use different credentials for development and production

## Verification

You can verify that your environment variables are configured correctly by running:

```bash
npm run verify-env
```

This will check:
- ✅ All required variables are present
- ✅ No quotes around values
- ✅ No extra whitespace
- ✅ Valid format for URLs and keys

## Environment-Specific Configuration

### Development

For development, use your Supabase project's development/staging credentials.

### Production

For production deployment, set these environment variables in your hosting platform:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Railway**: Project → Variables
- **Docker**: Use environment variables or `.env` file mounting

## Troubleshooting

### Common Issues

1. **"Missing Supabase URL or publishable key" error**
   - Check that all required variables are set in `.env`
   - Verify there are no typos in variable names
   - Run `npm run verify-env` to diagnose issues

2. **Variables not loading**
   - Restart your development server after changing `.env`
   - Ensure `.env` is in the project root directory
   - Check that variables start with `VITE_` prefix

3. **Authentication errors**
   - Verify your Supabase keys are correct
   - Check that your Supabase project is active
   - Ensure RLS policies are properly configured

### Getting Help

If you're still having issues:

1. Run the verification script: `npm run verify-env`
2. Check the browser console for error messages
3. Verify your Supabase project settings
4. Review the Supabase documentation

## Security Best Practices

- ✅ Use environment variables for all sensitive data
- ✅ Never hardcode credentials in your source code
- ✅ Use different credentials for different environments
- ✅ Regularly rotate your API keys
- ❌ Never commit `.env` files to version control
- ❌ Don't share credentials in plain text