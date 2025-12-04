# 3Dark - Git Branching Strategy

## Branch Structure

```
main (production)
  └── develop (staging/testing)
       └── feature/* (new features)
       └── fix/* (bug fixes)
       └── hotfix/* (urgent production fixes)
```

## Branch Types

### 1. **main** (Production)
- **Protected branch** - Always stable and ready for production
- Only merge from `develop` or `hotfix/*` branches
- Automatically deploys to Vercel production
- Requires pull request and review

### 2. **develop** (Staging)
- Integration branch for features
- Merge `feature/*` and `fix/*` branches here first
- Test thoroughly before merging to `main`
- Can deploy to a staging environment

### 3. **feature/** (New Features)
- Format: `feature/short-description`
- Examples:
  - `feature/user-login`
  - `feature/email-notifications`
  - `feature/product-reviews`
- Branch from: `develop`
- Merge to: `develop`

### 4. **fix/** (Bug Fixes)
- Format: `fix/short-description`
- Examples:
  - `fix/checkout-validation`
  - `fix/cart-quantity`
- Branch from: `develop`
- Merge to: `develop`

### 5. **hotfix/** (Urgent Production Fixes)
- Format: `hotfix/short-description`
- Examples:
  - `hotfix/payment-webhook`
  - `hotfix/critical-security`
- Branch from: `main`
- Merge to: both `main` AND `develop`

---

## Workflow Commands

### Starting New Feature
```bash
# 1. Update develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/user-login

# 3. Work on your feature
# ... make changes ...

# 4. Commit changes
git add .
git commit -m "Add user login feature"

# 5. Push to remote
git push origin feature/user-login

# 6. Create Pull Request on GitHub
# merge feature/user-login → develop

# 7. After merge, delete feature branch
git checkout develop
git pull origin develop
git branch -d feature/user-login
```

### Bug Fix
```bash
git checkout develop
git checkout -b fix/cart-quantity
# ... fix the bug ...
git add .
git commit -m "Fix cart quantity calculation"
git push origin fix/cart-quantity
# Create PR: fix/cart-quantity → develop
```

### Hotfix (Production Emergency)
```bash
git checkout main
git checkout -b hotfix/payment-critical
# ... fix the issue ...
git add .
git commit -m "Hotfix: Critical payment gateway issue"
git push origin hotfix/payment-critical

# Create PR to main first
# After merging to main, also merge to develop
git checkout develop
git merge hotfix/payment-critical
git push origin develop
```

### Release to Production
```bash
# After testing on develop, merge to main
git checkout main
git pull origin main
git merge develop
git push origin main
# Vercel will auto-deploy
```

---

## Commit Message Format

Use clear, descriptive commit messages:

```
Type: Short description

- Detail 1
- Detail 2
```

### Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Formatting, styling
- **refactor**: Code restructuring
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples:
```bash
git commit -m "feat: Add user login with email verification"
git commit -m "fix: Resolve checkout validation error"
git commit -m "docs: Update API documentation"
```

---

## Quick Reference

```bash
# Check current branch
git branch

# Create and switch to new branch
git checkout -b feature/new-feature

# Switch branches
git checkout develop

# See all branches
git branch -a

# Delete local branch
git branch -d feature/completed-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Update current branch with latest
git pull origin $(git branch --show-current)

# See what changed
git status
git diff
```

---

## Protected Branch Rules (GitHub Settings)

Set these up in GitHub repo settings:

### For `main` branch:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

### For `develop` branch:
- ✅ Require pull request reviews (optional)
- ✅ Require status checks to pass

---

## Current Workflow

Instead of:
```bash
git add .
git commit -m "changes"
git push origin main  # ❌ Direct to production
```

Do this:
```bash
git checkout -b feature/email-notifications
git add .
git commit -m "feat: Add Resend email service"
git push origin feature/email-notifications
# Create PR on GitHub → review → merge to develop → test → merge to main
```

---

## Benefits

1. **Safety**: Never break production
2. **Testing**: Test on `develop` before releasing
3. **Collaboration**: Multiple people can work on different features
4. **History**: Clear history of what changed and why
5. **Rollback**: Easy to revert changes if needed
6. **CI/CD**: Can set up different environments per branch

