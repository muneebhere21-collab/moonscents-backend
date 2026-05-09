# Domain & Hosting Deployment Checklist

Save this list to track progress as we configure the production environment.

### 1. Supabase Dashboard (Authentication & Security)
- [ ] **Site URL:** Go to Supabase Dashboard -> Authentication -> URL Configuration. Change the Site URL from `http://localhost:5173` to your new domain (e.g., `https://moonscents.pk`).
- [ ] **Redirect URIs:** In the same section, add your new domain's callback URLs (e.g., `https://moonscents.pk/**`).
- [ ] **Email Templates:** Update any magic links or password reset links in your Supabase email templates to use your new domain.

### 2. Project Environment Variables (Your `.env` files)
- [ ] **Frontend URL:** Update variables like `VITE_APP_URL=https://moonscents.pk`.
- [ ] **Backend/API URL:** Ensure API routes point to your live server (e.g., `VITE_API_URL=https://moonscents.pk/api`).
- [ ] **CORS Origins:** Update CORS settings for the Express server to accept traffic from your domain (`CORS_ORIGIN=https://moonscents.pk`).

### 3. Third-Party Services
- [ ] **Payment Gateway:** 
  - Update Webhook URL (e.g., `https://moonscents.pk/api/payments/webhook`).
  - Update Success/Cancel redirect URLs.
- [ ] **Google Login (if used):** Update "Authorized JavaScript origins" and "Authorized redirect URIs" in the Google Cloud Console.
- [ ] **Email Provider:** Verify your new domain in their dashboard (e.g., Resend, SendGrid).

### 4. Code & SEO Updates
- [ ] **Meta Tags:** Update hardcoded domain names in `index.html` or SEO components (like `og:url`).
- [ ] **Sitemap/Robots.txt:** Update absolute URLs so Google indexes your site properly.

### 5. Web Hosting
- [ ] **DNS Records:** Point your domain name's Nameservers or A Records to your new server IP address.
- [ ] **SSL Certificate:** Install a free SSL certificate (Let's Encrypt) so your site shows as secure (`https://`).
