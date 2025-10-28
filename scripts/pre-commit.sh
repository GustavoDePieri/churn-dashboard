#!/bin/sh
# Pre-commit hook to validate TypeScript and linting

echo "🔍 Running pre-commit checks..."

# Run type checking
echo "📝 Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Please fix TypeScript errors before committing."
  exit 1
fi

# Run linting
echo "🧹 Linting..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix linting errors before committing."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
exit 0
