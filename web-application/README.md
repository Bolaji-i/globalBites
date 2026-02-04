# GlobalBites - Web Application

A modern Next.js web application for discovering culinary delights from around the world. This project is built with Next.js 16, TypeScript, Tailwind CSS, and includes a complete Docker setup for both development and production environments.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Local Development](#local-development)
  - [Docker Development](#docker-development)
  - [Docker Production](#docker-production)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Docker Commands](#docker-commands)
- [Technology Stack](#technology-stack)
- [Learn More](#learn-more)

## ✨ Features

- **Next.js 16** with App Router for modern React applications
- **TypeScript** for type-safe code
- **Tailwind CSS v4** for utility-first styling
- **ESLint** for code quality and consistency
- **Docker** multi-stage builds for optimized images
- **Docker Compose** for easy local development
- **Hot Reloading** in Docker development environment
- **Production-Ready** Docker configuration

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### For Local Development:
- [Node.js](https://nodejs.org/) (v20 or higher - LTS recommended)
- [npm](https://www.npmjs.com/) (v10 or higher)

### For Docker Development:
- [Docker](https://www.docker.com/get-started) (v20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher)

## 📁 Project Structure

> **📖 Detailed Structure Guide:** See [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) for complete documentation.

```
web-application/
├── docs/                    # 📚 Documentation & guides
├── src/
│   ├── app/                # 🛣️ Next.js App Router (routes & pages)
│   │   ├── (auth)/        # 🔐 Auth routes group
│   │   ├── about/         # About page
│   │   ├── account/       # User account (protected)
│   │   └── api/           # API routes
│   ├── components/         # 🧩 React components
│   │   ├── authentication/ # Auth components
│   │   ├── user-account/   # Account components
│   │   └── ...            # Shared components
│   ├── lib/               # 🔧 Server utilities
│   ├── hooks/             # 🪝 Custom React hooks
│   ├── config/            # ⚙️ App configuration
│   └── types/             # 📝 TypeScript types
│       ├── globals.css      # Global styles
│       └── favicon.ico      # Favicon
├── public/                  # Static assets
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose configuration
├── .dockerignore          # Docker ignore patterns
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── postcss.config.mjs     # PostCSS configuration
├── eslint.config.mjs      # ESLint configuration
└── package.json           # Project dependencies
```

## 🚀 Getting Started

### Local Development

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

3. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

The page will auto-update as you edit files in the `src/` directory.

### Docker Development

Docker development mode provides hot reloading and is ideal for development with container consistency.

1. **Build and start the development container:**

```bash
docker-compose up --build
```

Or run in detached mode:

```bash
docker-compose up -d --build
```

2. **Access the application:**

Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **View logs (if running detached):**

```bash
docker-compose logs -f web
```

4. **Stop the containers:**

```bash
docker-compose down
```

### Docker Production

For production deployment, use the optimized production build.

1. **Build the production image:**

```bash
docker build -t globalbites-web:production --target production .
```

2. **Run the production container:**

```bash
docker run -p 3000:3000 --name globalbites-web-prod globalbites-web:production
```

3. **Access the application:**

Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Stop the container:**

```bash
docker stop globalbites-web-prod
docker rm globalbites-web-prod
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |

## 🔧 Environment Variables

To use environment variables, create a `.env.local` file in the root directory:

```bash
# .env.local (not tracked in git)
NEXT_PUBLIC_API_URL=your_api_url_here
# Add other environment variables as needed
```

**Note:** Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## 🐳 Docker Commands

### Development Commands

```bash
# Build and start development environment
docker-compose up --build

# Start existing containers
docker-compose up

# Stop containers
docker-compose down

# View logs
docker-compose logs -f web

# Rebuild without cache
docker-compose build --no-cache

# Execute commands in running container
docker-compose exec web npm run lint
```

### Production Commands

```bash
# Build production image
docker build -t globalbites-web:production --target production .

# Build development image
docker build -t globalbites-web:development --target development .

# Run production container with custom port
docker run -p 8080:3000 --name globalbites-web-prod globalbites-web:production

# Check running containers
docker ps

# Stop and remove container
docker stop globalbites-web-prod && docker rm globalbites-web-prod

# View container logs
docker logs -f globalbites-web-prod
```

## 🛠 Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) - React framework with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- **Linting:** [ESLint](https://eslint.org/) - Code quality tool
- **Containerization:** [Docker](https://www.docker.com/) - Container platform
- **Package Manager:** [npm](https://www.npmjs.com/) - Node package manager

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Next.js App Router](https://nextjs.org/docs/app) - Learn about the App Router
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript handbook
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Tailwind CSS guide
- [Docker Documentation](https://docs.docker.com/) - Docker guides and reference

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is part of the GlobalBites application.

---

Built with ❤️ using Next.js and Docker
