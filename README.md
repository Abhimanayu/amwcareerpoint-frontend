# AMW Career Point - Frontend

A modern, responsive Next.js website for AMW Career Point, a premier MBBS abroad consultancy service.

## Features

- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Responsive Design**: Optimized for all devices and screen sizes
- **SEO Optimized**: Server-side rendering and meta tag optimization
- **Dynamic Content**: Country and university pages with detailed information
- **Blog System**: Integrated blog with categories and dynamic routing
- **Contact Forms**: Interactive contact and inquiry forms
- **Performance Focused**: Fast loading times and optimized images

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the website.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── countries/         # Countries listing and detail pages
│   ├── universities/      # Universities listing and detail pages
│   ├── blogs/            # Blog listing and article pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable React components
│   ├── layout/          # Layout components (Header, Footer)
│   └── ui/              # UI components (Button, Card)
└── lib/                 # Utilities and data
    ├── data/            # Static data files
    └── utils.ts         # Utility functions
```

## Key Pages

- **Homepage**: Hero section with services overview and call-to-actions
- **About**: Company information and team details
- **Countries**: Study destinations with detailed country information
- **Universities**: Medical universities with admission details
- **Blogs**: Educational articles and news
- **Contact**: Contact forms and company information

## Development

The project uses:
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint** for code quality

## Deployment

The website is optimized for deployment on:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

## License

© 2024 AMW Career Point. All rights reserved.

## 🛠️ Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Custom reusable components
- **Build Tool**: Turbopack (Next.js)

## 📄 Pages Overview

### 🏠 Home Page (`/`)
- Hero section with call-to-action
- Features showcase
- Popular countries preview
- Testimonials and stats

### 📖 About Page (`/about`)
- Company story and mission
- Team information
- Values and achievements
- Service overview

### 📞 Contact Page (`/contact`)
- Contact form
- Contact information
- FAQ section
- Office details

### 🌍 Countries Pages
- **Listing** (`/countries`): All available countries
- **Detail** (`/countries/[slug]`): Individual country information
  - Country overview
  - Universities in that country
  - Admission requirements
  - Fee structure

### 🎓 Universities Pages
- **Listing** (`/universities`): All universities
- **Detail** (`/universities/[slug]`): Individual university information
  - University details
  - Facilities and courses
  - Admission process
  - Fee breakdown

### 📝 Blog Pages
- **Listing** (`/blog`): All blog posts
- **Article** (`/blog/[slug]`): Individual blog posts
  - Full article content
  - Related articles
  - Author information
  - Tags and categories

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to project directory**
   ```bash
   cd "c:\Users\Abhimanyu Singh\Desktop\medconsult-website"
   ```

2. **Install dependencies** (Already installed)
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📲 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1280px+)

## 🎨 UI Components

### Button Component
```tsx
<Button variant="default" size="lg">
  Get Consultation
</Button>
```

### Card Component
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

## 📊 Sample Data

The project includes comprehensive dummy data for:

- **4 Countries**: Russia, Ukraine, Georgia, Kazakhstan
- **5 Universities**: Top medical universities with complete details
- **4 Blog Posts**: Educational articles about MBBS abroad
- **Complete Information**: Fees, eligibility, facilities, etc.

## 🔧 Customization

### Adding New Countries
1. Add country data to `src/lib/data/countries.ts`
2. Add corresponding universities to `src/lib/data/universities.ts`
3. Routes will be automatically generated

### Adding New Universities
1. Add university data to `src/lib/data/universities.ts`
2. Dynamic routes will handle the new entries

### Adding Blog Posts
1. Add blog post data to `src/lib/data/blogs.ts`
2. Include proper slug, content, and metadata

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update component styles in respective files
- Add custom CSS in `src/app/globals.css`

## 🌟 Key Features Implemented

- ✅ **SEO Optimized**: Meta tags, structured data
- ✅ **Mobile Responsive**: Works on all devices
- ✅ **Fast Loading**: Optimized with Next.js and Turbopack
- ✅ **Type Safe**: Full TypeScript implementation
- ✅ **Dynamic Routing**: Automatic route generation
- ✅ **Reusable Components**: Modular architecture
- ✅ **Clean Code**: Well-organized and documented

## 📈 Performance

- **Build Time**: ~3 seconds
- **Bundle Size**: Optimized with Next.js
- **Loading Speed**: Fast with static generation
- **SEO Score**: Optimized for search engines

## 🚀 How to Run the Project

1. **Open Terminal/Command Prompt**

2. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\Abhimanyu Singh\Desktop\medconsult-website"
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## 🌐 Available Routes

- `/` - Home page
- `/about` - About us page
- `/contact` - Contact form and information
- `/countries` - List of all countries
- `/countries/russia` - Russia details
- `/countries/ukraine` - Ukraine details
- `/countries/georgia` - Georgia details
- `/countries/kazakhstan` - Kazakhstan details
- `/universities` - List of all universities
- `/universities/[slug]` - Individual university pages
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog articles

---

**🎉 Project successfully created and ready to run!**

The website is fully functional with all requested features:
- Complete Next.js setup with TypeScript
- Responsive design with Tailwind CSS
- Dynamic routing for countries, universities, and blog
- Reusable UI components
- SEO-optimized structure
- Mobile-friendly layout
- Production-ready code

To start developing, run `npm run dev` and open http://localhost:3000
