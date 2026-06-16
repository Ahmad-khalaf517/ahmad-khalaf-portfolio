# Ahmad Khalaf Portfolio

A modern and responsive portfolio website built with **Next.js**, **TypeScript**, and **Tailwind CSS** to showcase my professional experience, technical skills, and featured projects.

## Live Demo

Visit the deployed website: [https://ahmad-khalaf-portfolio.vercel.app/](https://ahmad-khalaf-portfolio.vercel.app/)

## About

I'm Ahmad Khalaf, a Front-End Developer with more than 5 years of experience building scalable and high-performance web applications.

My expertise includes React, TypeScript, modern UI development, performance optimization, API integration, and building responsive user experiences. I also have experience working with backend technologies such as NestJS, Flask, PostgreSQL, and MySQL.

## Features

* Responsive design across all devices
* Modern and accessible user interface
* Professional experience timeline
* Skills and technology showcase
* Featured projects section
* Contact information and social links
* SEO optimization
* Fast performance and optimized loading
* Dark mode support

## Project Structure

```text
├── app/
│   ├── api/
│   │   └── version/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── assets/
│   ├── icons/
│   └── images/
├── components/
│   ├── app/
│   │   ├── section-content.tsx
│   │   ├── section-title.tsx
│   │   ├── section.tsx
│   │   └── update-banner.tsx
│   ├── layout/
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   └── navbar.tsx
│   ├── sections/
│   │   ├── about.tsx
│   │   ├── contact.tsx
│   │   ├── experience.tsx
│   │   ├── hero.tsx
│   │   ├── hire-me.tsx
│   │   ├── projects.tsx
│   │   ├── skills.tsx
│   │   └── technologies.tsx
│   └── ui/
│       ├── animated-border-button.tsx
│       └── button.tsx
├── hooks/
│   ├── useAppVersion.ts
│   └── useScrolledY.ts
└── public/
    └── projects/
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 20+
* pnpm

### Clone the Repository

```bash
git clone git@github.com:Ahmad-khalaf517/MyPortfolio.git
cd MyPortfolio
```

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root and add the following EmailJS keys:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### Run the Development Server

```bash
pnpm dev
```

Open your browser and navigate to:

```text
http://localhost:3000
```

### Build for Production

```bash
pnpm run build
```

### Start Production Server

```bash
pnpm run start
```

## Contact

* Email: [AhmadKhalaf517@gmail.com](mailto:AhmadKhalaf517@gmail.com)
* LinkedIn: [linkedin.com/in/ahmad-khalaf](https://www.linkedin.com/in/ahmad-khalaf-7a2637264/)
* GitHub: [github.com/Ahmad-khalaf517](https://github.com/Ahmad-khalaf517)

---

Built with ❤️ using Next.js, TypeScript and Tailwind CSS.
