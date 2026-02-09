# Contributing to Farm-Secure

Thank you for your interest in contributing to Farm-Secure! This document provides guidelines and instructions for contributing to the project.

## 🌟 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js v18 or later
- PostgreSQL v14 or later
- Git
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/farm-secure.git
     cd farm-secure
     ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/farm-secure.git
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env if needed
   ```

5. **Initialize the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```

## 📝 Development Workflow

### Creating a New Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   npm test
   
   # Frontend tests
   cd frontend
   npm test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add livestock batch tracking
fix: resolve authentication token expiry issue
docs: update API documentation for risk assessment
refactor: optimize dashboard data fetching
```

### Submitting a Pull Request

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill in the PR template with:
     - Description of changes
     - Related issue numbers
     - Screenshots (if UI changes)
     - Testing steps

4. **Address review feedback**
   - Make requested changes
   - Push updates to the same branch
   - Respond to comments

## 🏗️ Project Structure

### Backend (`/backend`)

```
backend/
├── prisma/              # Database schema and migrations
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── validators/      # Input validation
│   └── utils/           # Helper functions
└── server.ts            # Entry point
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── layout/     # Layout components
│   │   └── ...         # Feature-specific components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── lib/            # Utilities
│   └── utils/          # Helper functions
└── public/             # Static assets
```

## 🎨 Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for type safety
- Use meaningful variable and function names
- Keep functions small and focused
- Use async/await over promises
- Add JSDoc comments for complex functions

```typescript
/**
 * Calculates the biosecurity risk score based on assessment answers
 * @param answers - Array of assessment question answers
 * @returns Risk score between 0-100
 */
async function calculateRiskScore(answers: Answer[]): Promise<number> {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props

```typescript
interface DashboardProps {
  farmId: string;
  onRefresh?: () => void;
}

export function Dashboard({ farmId, onRefresh }: DashboardProps) {
  // Component implementation
}
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design (mobile-first)
- Use semantic color names from the theme

## 🧪 Testing

### Writing Tests

- Write unit tests for business logic
- Write integration tests for API endpoints
- Test edge cases and error handling
- Aim for meaningful test coverage

### Running Tests

```bash
# Backend
cd backend
npm test
npm run test:watch  # Watch mode

# Frontend
cd frontend
npm test
npm run test:coverage  # With coverage
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex algorithms
- Include usage examples
- Keep README files up to date

### API Documentation

When adding new endpoints:
1. Document in the main README
2. Add request/response examples
3. Document error responses
4. Update Postman collection (if applicable)

## 🐛 Reporting Bugs

### Before Submitting

- Check if the bug has already been reported
- Verify it's reproducible
- Collect relevant information

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
- Database: [e.g., PostgreSQL 14]

**Screenshots**
If applicable

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

We welcome feature suggestions! Please:
1. Check if the feature has been requested
2. Describe the use case
3. Explain the expected behavior
4. Provide examples or mockups if possible

## 🔍 Code Review Process

All submissions require review. We look for:
- Code quality and readability
- Test coverage
- Documentation
- Performance implications
- Security considerations
- Adherence to project standards

## 📋 Checklist Before Submitting PR

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Commit messages follow convention
- [ ] PR description is complete

## 🎯 Areas for Contribution

Looking for where to start? Check out:
- Issues labeled `good first issue`
- Issues labeled `help wanted`
- Documentation improvements
- Test coverage improvements
- Performance optimizations
- Accessibility enhancements

## 📞 Getting Help

- Open a discussion on GitHub
- Join our community chat (if available)
- Ask questions in pull request comments
- Review existing documentation

## 🙏 Thank You!

Your contributions make Farm-Secure better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
