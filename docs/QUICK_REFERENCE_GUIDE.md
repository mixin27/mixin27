# Quick Reference Guide

## 🚀 Adding a New App Privacy Policy

### Step 1: Add to apps.json
```json
{
  "id": "awesome-app",
  "name": "Awesome App",
  "description": "An awesome mobile application",
  "icon": "/apps/awesome-app/icon.png",
  "category": "productivity",
  "platform": "both",
  "storeLinks": {
    "playStore": "https://play.google.com/store/apps/details?id=com.example.awesome",
    "appStore": "https://apps.apple.com/app/awesome-app/id123456789"
  },
  "privacyPolicy": {
    "lastUpdated": "2024-10-15",
    "version": "1.0.0"
  },
  "status": "active",
  "releaseDate": "2024-01-15"
}
```

### Step 2: Create Privacy Policy
```bash
mkdir -p content/apps/awesome-app
cp content/apps/template.mdx content/apps/awesome-app/privacy.mdx
```

### Step 3: Edit Privacy Policy
Edit `content/apps/awesome-app/privacy.mdx` and customize the content.

### Step 4: Done!
Your privacy policy is live at `/apps/awesome-app/privacy`

---

## 📝 Adding a Blog Post

### Create file: `content/blog/my-post.mdx`
```markdown
---
title: My Awesome Blog Post
description: A brief description of the post
date: 2024-10-15
category: tutorial
tags: [nextjs, tailwind, typescript]
featured: true
published: true
---

# My Blog Post

Your content here...
```

---

## 🎨 Customizing Colors

Edit `app/globals.css`:

```css
@theme {
  /* Change primary color */
  --color-primary-500: oklch(0.62 0.20 250);

  /* Change font */
  --font-sans: 'Your Font', system-ui, sans-serif;
}
```

For dark mode colors, edit under `.dark` selector:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other colors */
}
```

---

## 🔧 Common Tailwind v4 Classes

### Spacing (Dynamic)
- `p-17` - Padding: 17 * 0.25rem
- `mt-29` - Margin top: 29 * 0.25rem
- `w-42` - Width: 42 * 0.25rem

### Gradients
```html
<!-- Linear gradient -->
<div class="bg-linear-to-r from-blue-500 to-purple-500"></div>

<!-- Radial gradient -->
<div class="bg-radial from-center to-edge"></div>

<!-- Conic gradient -->
<div class="bg-conic from-red-500 to-blue-500"></div>
```

### Container Queries
```html
<div class="@container">
  <div class="@sm:grid-cols-2 @lg:grid-cols-4">
    <!-- Responds to container size -->
  </div>
</div>
```

### 3D Transforms
```html
<div class="perspective-normal rotate-x-45 rotate-y-30">
  3D transformed element
</div>
```

---

## 📱 App Categories

Available categories for `apps.json`:
- `fitness`
- `productivity`
- `weather`
- `finance`
- `social`
- `other`

---

## 🎯 Platform Options

Available platforms for apps:
- `android` - Android only
- `ios` - iOS only
- `both` - Both platforms

---

## 📊 App Status Options

Available status values:
- `active` - Currently available
- `deprecated` - No longer maintained
- `development` - In development

---

## 🔍 Useful Utility Functions

### Format Date
```typescript
import { formatDate } from '@/lib/utils';

formatDate('2024-10-15'); // "October 15, 2024"
```

### Get Relative Time
```typescript
import { getRelativeTime } from '@/lib/utils';

getRelativeTime('2024-10-13'); // "2 days ago"
```

### Slugify
```typescript
import { slugify } from '@/lib/utils';

slugify('My Awesome Post'); // "my-awesome-post"
```

### Truncate Text
```typescript
import { truncate } from '@/lib/utils';

truncate('Long text here...', 50); // "Long text here..."
```

---

## 🛠️ Debugging

### Clear Build Cache
```bash
rm -rf .next
npm run dev
```

### Type Check
```bash
npm run type-check
```

### View Build Output
```bash
npm run build
```

### Check for Errors
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests

---

## 📦 Installing shadcn/ui Components

### Button
```bash
npx shadcn@latest add button
```

### Card
```bash
npx shadcn@latest add card
```

### Dialog
```bash
npx shadcn@latest add dialog
```

### Form Components
```bash
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
```

---

## 🌐 Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_EMAIL=your-email@example.com
```

### Production (Vercel)
Set in Vercel dashboard:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_EMAIL`
- Other public variables

---

## 📸 Image Optimization

### Add Images
1. Place in `public/` folder
2. Use Next.js Image component:

```tsx
import Image from 'next/image';

<Image
  src="/images/my-image.jpg"
  alt="Description"
  width={800}
  height={600}
  className="rounded-lg"
/>
```

---

## 🎨 Custom Components Location

- **UI Components:** `components/ui/` (shadcn)
- **Layout Components:** `components/layout/`
- **Shared Components:** `components/shared/`
- **Page-specific:** `components/[page-name]/`

---

## 📝 MDX Components

You can use React components in MDX:

```mdx
import { CustomComponent } from '@/components/custom';

# My Post

<CustomComponent prop="value" />
```

---

## 🔒 Legal Pages

Create in `app/legal/`:
- `privacy/page.tsx` - Privacy policy
- `terms/page.tsx` - Terms of service
- `cookie-policy/page.tsx` - Cookie policy

---

## ⚡ Performance Tips

1. **Images:** Always use Next.js Image component
2. **Fonts:** Use Next.js font optimization
3. **Code Splitting:** Use dynamic imports for large components
4. **Caching:** Leverage Next.js caching strategies
5. **Bundle Size:** Regularly check with `npm run build`

---

## 🚢 Deployment Checklist

- [ ] All environment variables set
- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors
- [ ] All links tested
- [ ] Images optimized
- [ ] Meta tags complete
- [ ] Analytics configured (optional)
- [ ] Domain configured (optional)

---

## 📞 Getting Help

If you need help with any part of the setup:

1. Check this Quick Reference
2. Review the Setup Checklist (SETUP.md)
3. Check Next.js docs: https://nextjs.org/docs
4. Check Tailwind v4 docs: https://tailwindcss.com/docs
5. Check the README.md for more details

---

Happy coding! 🎉
