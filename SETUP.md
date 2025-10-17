# Portfolio Setup Checklist

Follow this checklist to set up your portfolio from scratch.

## ✅ Phase 1: Initial Setup

- [ ] Run installation commands from `portfolio_setup` artifact
- [ ] Create `.env.local` from `.env.example`
- [ ] Update environment variables with your information
- [ ] Test development server: `npm run dev`

## ✅ Phase 2: Project Structure

- [ ] Create all folders as per the project structure
- [ ] Copy all component files to their locations
- [ ] Copy all lib utilities to `lib/` folder
- [ ] Copy all type definitions to `types/` folder

## ✅ Phase 3: Content Setup

### Apps Configuration
- [ ] Create `content/apps/` folder
- [ ] Add `apps.json` configuration file
- [ ] Copy `template.mdx` for privacy policy template
- [ ] Add your first app to `apps.json`

### Blog Setup (Optional)
- [ ] Create `content/blog/` folder
- [ ] Add your first blog post (if needed)

### Projects Setup (Optional)
- [ ] Create `content/projects/` folder
- [ ] Add your first project (if needed)

## ✅ Phase 4: Styling & Theme

- [ ] Replace `app/globals.css` with Tailwind v4 configuration
- [ ] Customize colors in `@theme` directive
- [ ] Update font families if needed
- [ ] Test dark mode functionality

## ✅ Phase 5: Components

### Layout Components
- [ ] Add `components/layout/header.tsx`
- [ ] Add `components/layout/footer.tsx`
- [ ] Add `components/theme-provider.tsx`
- [ ] Update social links in header/footer

### shadcn/ui Components
- [ ] Run `npx shadcn@latest add button`
- [ ] Run `npx shadcn@latest add card`
- [ ] Add any other components you need

## ✅ Phase 6: Pages

- [ ] Replace `app/layout.tsx` with root layout
- [ ] Replace `app/page.tsx` with homepage
- [ ] Add `app/apps/page.tsx` (apps listing)
- [ ] Add `app/apps/[appId]/privacy/page.tsx` (dynamic privacy)
- [ ] Create `app/about/page.tsx` (optional)
- [ ] Create `app/contact/page.tsx` (optional)
- [ ] Create `app/projects/page.tsx` (optional)
- [ ] Create `app/blog/page.tsx` (optional)

## ✅ Phase 7: Legal Pages

- [ ] Create `app/legal/privacy/page.tsx`
- [ ] Create `app/legal/terms/page.tsx`
- [ ] Create `app/legal/cookie-policy/page.tsx`
- [ ] Write content for each legal page

## ✅ Phase 8: Customization

- [ ] Update site metadata in `app/layout.tsx`
- [ ] Update personal information in all pages
- [ ] Replace placeholder images with your own
- [ ] Update social media links
- [ ] Customize color scheme
- [ ] Add your profile picture/avatar

## ✅ Phase 9: Content

### Add Your Apps
- [ ] For each app, add entry to `apps.json`
- [ ] Create app folder: `content/apps/{app-id}/`
- [ ] Copy and customize `template.mdx` to `privacy.mdx`
- [ ] Update privacy policy content
- [ ] Add app icon to `public/apps/{app-id}/`

### Add Projects (Optional)
- [ ] Create project MDX files
- [ ] Add project images
- [ ] Test project pages

### Add Blog Posts (Optional)
- [ ] Create blog post MDX files
- [ ] Add cover images
- [ ] Test blog pages

## ✅ Phase 10: SEO & Metadata

- [ ] Add `robots.txt` to `public/`
- [ ] Add `sitemap.xml` to `public/` (or generate dynamically)
- [ ] Add Open Graph image: `public/og-image.png`
- [ ] Verify all meta tags in pages
- [ ] Test social media previews

## ✅ Phase 11: Testing

- [ ] Test all navigation links
- [ ] Test dark/light mode toggle
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test app privacy policy pages
- [ ] Verify all external links open in new tab
- [ ] Check for console errors
- [ ] Run `npm run build` to check for build errors
- [ ] Test production build: `npm run build && npm start`

## ✅ Phase 12: Deployment

### Pre-deployment
- [ ] Set up Git repository
- [ ] Commit all changes
- [ ] Push to GitHub/GitLab

### Vercel Deployment
- [ ] Create Vercel account (if needed)
- [ ] Import project from Git
- [ ] Configure environment variables in Vercel
- [ ] Set custom domain (optional)
- [ ] Deploy!

### Post-deployment
- [ ] Test live site
- [ ] Verify all pages work
- [ ] Check analytics (if configured)
- [ ] Submit sitemap to Google Search Console

## ✅ Phase 13: Maintenance

- [ ] Set up automatic deployments
- [ ] Monitor site performance
- [ ] Regular content updates
- [ ] Keep dependencies updated
- [ ] Backup content regularly

## 📝 Quick Commands Reference

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint

# Type check
npm run type-check

# Format code
npm run format

# Add shadcn component
npx shadcn@latest add [component-name]
```

## 🆘 Troubleshooting

### Build fails
- Check all imports are correct
- Verify all MDX files have valid frontmatter
- Run `npm run type-check`

### Privacy pages not showing
- Verify app exists in `apps.json`
- Check privacy.mdx file exists in correct folder
- Ensure app `id` matches folder name

### Styles not applying
- Clear `.next` folder and rebuild
- Check Tailwind classes are valid
- Verify `globals.css` is imported

### Dark mode not working
- Check ThemeProvider is in layout
- Verify next-themes is installed
- Clear browser cache

## 🎉 You're Done!

Your portfolio is now ready! Remember to:
- Keep content updated
- Monitor performance
- Engage with visitors
- Share your work

Need help? Create an issue or reach out!
