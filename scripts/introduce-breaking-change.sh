#!/bin/bash

# Script to introduce a breaking change for rollback testing
# This script creates a test branch with a failing health check

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "app/api/health/route.ts" ]; then
    print_error "Must be run from the monportfolio directory"
    exit 1
fi

print_header "Introducing Breaking Change for Rollback Test"

# Create backup of current health check
print_info "Creating backup of current health check..."
cp app/api/health/route.ts app/api/health/route.ts.backup
print_success "Backup created: app/api/health/route.ts.backup"

# Show options
echo -e "\n${BLUE}Select breaking change type:${NC}"
echo "1. Return 500 error (health check fails)"
echo "2. Throw exception (application crash)"
echo "3. Return invalid JSON"
echo "4. Infinite loop (timeout)"
echo "5. Restore from backup"
echo -n "Select option: "
read -r choice

case $choice in
    1)
        print_info "Creating health check that returns 500 error..."
        cat > app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  // BREAKING CHANGE: Simulate failing health check for rollback testing
  return NextResponse.json(
    {
      status: 'unhealthy',
      error: 'Simulated failure for rollback testing',
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}
EOF
        print_success "Health check modified to return 500 error"
        ;;
    
    2)
        print_info "Creating health check that throws exception..."
        cat > app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  // BREAKING CHANGE: Simulate application crash for rollback testing
  throw new Error('Simulated application crash for rollback testing');
}
EOF
        print_success "Health check modified to throw exception"
        ;;
    
    3)
        print_info "Creating health check that returns invalid JSON..."
        cat > app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  // BREAKING CHANGE: Return invalid response for rollback testing
  return new Response('This is not valid JSON', { status: 200 });
}
EOF
        print_success "Health check modified to return invalid JSON"
        ;;
    
    4)
        print_info "Creating health check with infinite loop..."
        cat > app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  // BREAKING CHANGE: Infinite loop causes timeout for rollback testing
  while (true) {
    // This will cause the health check to timeout
  }
  
  return NextResponse.json(
    { status: 'healthy', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
EOF
        print_success "Health check modified with infinite loop"
        ;;
    
    5)
        if [ -f "app/api/health/route.ts.backup" ]; then
            print_info "Restoring from backup..."
            cp app/api/health/route.ts.backup app/api/health/route.ts
            print_success "Health check restored from backup"
        else
            print_error "No backup file found"
            exit 1
        fi
        ;;
    
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

# Show the modified file
print_header "Modified Health Check File"
cat app/api/health/route.ts

# Instructions
print_header "Next Steps"
echo "1. Review the changes above"
echo "2. Commit the changes: git add app/api/health/route.ts"
echo "3. Commit: git commit -m 'test: introduce breaking change for rollback testing'"
echo "4. Push to trigger deployment: git push origin main"
echo "5. Monitor the deployment in GitHub Actions"
echo "6. Watch Kubernetes for automatic rollback"
echo ""
print_warning "Remember to restore the health check after testing!"
echo "Run: ./scripts/introduce-breaking-change.sh and select option 5"
echo "Or: cp app/api/health/route.ts.backup app/api/health/route.ts"
