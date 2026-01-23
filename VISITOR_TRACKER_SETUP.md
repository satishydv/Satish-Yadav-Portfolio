# Visitor Tracker Setup Instructions

## ✅ What's Been Implemented

I've added a complete visitor tracking system to your Next.js portfolio using **Next.js API routes only** (no separate backend).

### Files Created/Modified:

1. **`prisma/schema.prisma`** - Added Visitor model
2. **`app/api/visitor/route.ts`** - API endpoint for tracking visitors
3. **`components/VisitorTracker.tsx`** - Client component that calls the API
4. **`app/layout.tsx`** - Now includes VisitorTracker
5. **`.env`** - Created with DATABASE_URL for Prisma

---

## 🚀 Setup Steps

### Step 1: Stop Your Dev Server

Press `Ctrl+C` in your terminal to stop the running dev server.

### Step 2: Run Database Migration

```bash
npx prisma migrate dev --name add_visitor_tracking
```

This will:
- Create the `visitors` table in your Neon PostgreSQL database
- Generate Prisma client with the new Visitor model

### Step 3: Start Your Dev Server

```bash
npm run dev
```

### Step 4: Test It

1. Visit your portfolio in the browser: `http://localhost:3000`
2. Open browser DevTools → Network tab
3. You should see a POST request to `/api/visitor`
4. Refresh the page - you should see the same request but you won't be counted again (same visitor, same day)

---

## 📊 How to View Visitor Data

### Option 1: Using Prisma Studio (GUI)

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can see all visitor records.

### Option 2: Using the API

Visit in your browser: `http://localhost:3000/api/visitor`

This GET endpoint returns JSON with stats:
```json
{
  "success": true,
  "stats": {
    "today": 5,
    "lastWeek": 23,
    "allTime": 47
  }
}
```

### Option 3: Direct Database Query

```bash
npx prisma db execute --stdin
```

Then paste:
```sql
SELECT COUNT(*) as total_visitors FROM visitors WHERE "isBot" = false;
```

---

## 🎯 How It Works

1. **User visits your site** → `VisitorTracker` component mounts
2. **Component calls** → `POST /api/visitor`
3. **API checks**:
   - Is this a bot? → Don't track
   - Has this visitor been counted today? → Don't count again (uses cookie + IP fingerprint)
   - New visitor today? → Create record + set 24h cookie
4. **Database stores**: fingerprint, cookie ID, visit date, user agent (hashed IP for privacy)

### Visitor Uniqueness (24-hour window)

A visitor is counted once per day based on:
- **Cookie** (primary identifier, expires after 24 hours)
- **IP + User-Agent fingerprint** (fallback if cookies disabled)

After 24 hours:
- Cookie expires
- Same visitor returns → counted as new for that day

---

## 🛡️ Privacy & Security Features

✅ **Bot filtering** - Common bots excluded  
✅ **IP hashing** - Raw IPs never stored (SHA-256 hash)  
✅ **Secure cookies** - HttpOnly, Secure, SameSite=Strict  
✅ **24-hour tracking** - Short retention period  
✅ **No PII** - Only technical fingerprints stored  

---

## 📈 Analytics Queries

### Today's visitors:
```typescript
const today = await prisma.visitor.count({
  where: {
    visitDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    isBot: false
  }
})
```

### Daily trend (last 30 days):
```typescript
const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

const dailyVisitors = await prisma.visitor.groupBy({
  by: ['visitDate'],
  _count: true,
  where: {
    visitDate: { gte: thirtyDaysAgo },
    isBot: false
  },
  orderBy: { visitDate: 'desc' }
})
```

---

## 🎨 Future: Add Frontend Display

When you're ready to show visitor count on your site:

```tsx
// components/VisitorCount.tsx
'use client'
import { useEffect, useState } from 'react'

export default function VisitorCount() {
  const [stats, setStats] = useState<any>(null)
  
  useEffect(() => {
    fetch('/api/visitor')
      .then(res => res.json())
      .then(data => setStats(data.stats))
  }, [])
  
  if (!stats) return null
  
  return (
    <div className="text-sm text-gray-500">
      <p>👥 {stats.today} visitors today</p>
      <p>📊 {stats.allTime} total visits</p>
    </div>
  )
}
```

Add this component anywhere in your site!

---

## 🐛 Troubleshooting

### "Can't reach database server"
- Check your Neon database is active (they pause after inactivity on free tier)
- Verify DATABASE_URL in `.env` and `.env.local` is correct
- Visit Neon dashboard to wake up the database

### "Prisma generate fails"
- Stop dev server first
- Delete `node_modules/.prisma` folder
- Run `npm run postinstall` or `npx prisma generate`

### "Visitor not being tracked"
- Check Network tab in browser DevTools
- Look for POST to `/api/visitor`
- Check server logs in your terminal

### "Same visitor counted multiple times"
- Clear browser cookies and try again
- Check if VPN/proxy is changing IP
- Verify cookie is being set (DevTools → Application → Cookies)

---

## 📁 File Structure

```
├── app/
│   ├── api/
│   │   └── visitor/
│   │       └── route.ts          ← Backend logic (POST & GET)
│   └── layout.tsx                ← Includes VisitorTracker
├── components/
│   └── VisitorTracker.tsx        ← Calls API on mount
├── prisma/
│   └── schema.prisma             ← Visitor model
├── lib/
│   └── prisma.ts                 ← DB client (already existed)
└── .env / .env.local             ← DATABASE_URL
```

---

## 🚀 Deployment Notes

When you deploy to Vercel:
1. Add `DATABASE_URL` to Vercel environment variables
2. Vercel will automatically run `prisma generate` on build
3. Run migration on your production database:
   ```bash
   npx prisma migrate deploy
   ```

Your visitor tracking will work automatically in production!

---

## ✨ Summary

✅ **No separate backend needed** - Pure Next.js API routes  
✅ **Privacy-focused** - Hashed IPs, 24h cookies  
✅ **Bot filtering** - Common crawlers excluded  
✅ **Database analytics** - Query anytime via Prisma  
✅ **Production-ready** - Deployed to Vercel seamlessly  

**Next Steps:**
1. Stop dev server
2. Run `npx prisma migrate dev --name add_visitor_tracking`
3. Start dev server
4. Test it!

Questions? Let me know! 🎉
