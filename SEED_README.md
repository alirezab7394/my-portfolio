# Database Seeding Guide

## Overview

The seed script populates your My Coach database with sample data for development and testing purposes.

## What the Seed Creates

### Sample Data Included:

- **1 Admin User**: Platform administrator
- **4 Coach Users**: Different coaching specialties
- **5 Client Users**: Various coaching goals
- **4 Coach Profiles**: Detailed coach information with specialties and rates
- **5 Client Profiles**: Client goals and interests
- **6 Sessions**: Mix of completed and scheduled sessions
- **5 Reviews**: Sample reviews for coaches

### Sample Users Created:

#### Admin

- **Email**: admin@mycoach.com
- **Name**: Admin User
- **Role**: ADMIN

#### Coaches

1. **Sarah Johnson** (sarah.johnson@email.com)

   - Specialties: Life Coaching, Career Development, Leadership, Stress Management
   - Rate: $120/hour, 8 years experience, Verified

2. **Michael Chen** (michael.chen@email.com)

   - Specialties: Executive Coaching, Business Strategy, Team Building, Entrepreneurship
   - Rate: $200/hour, 12 years experience, Verified

3. **Emma Davis** (emma.davis@email.com)

   - Specialties: Wellness Coaching, Mindfulness, Anxiety Management, Habit Formation
   - Rate: $85/hour, 5 years experience, Verified

4. **David Wilson** (david.wilson@email.com)
   - Specialties: Career Transition, Resume Building, Interview Preparation, Networking
   - Rate: $95/hour, 10 years experience, Not Verified

#### Clients

1. **Alice Brown** - Goals: Work-life balance, Leadership skills, Stress management
2. **John Smith** - Goals: Start business, Public speaking, Build confidence
3. **Lisa Taylor** - Goals: Career change to tech, Interview skills, Professional network
4. **Robert Garcia** - Goals: Reduce anxiety, Healthy habits, Improve focus
5. **Maria Martinez** - Goals: Executive presence, Team management, Strategic thinking

## Running the Seed

### Prerequisites

1. MongoDB database must be accessible
2. Environment variable `DATABASE_URL` must be set
3. Prisma client must be generated

### Commands

```bash
# Install dependencies (if not already done)
npm install

# Generate Prisma client
npx prisma generate

# Set environment variable and run seed (PowerShell)
$env:DATABASE_URL="your_mongodb_connection_string"; npm run db:seed

# Or run seed with npm script
npm run db:seed
```

### Alternative Methods

If you're having connection issues, you can also use:

```bash
# Using Prisma's built-in seed command
npx prisma db seed

# Or run the TypeScript file directly
npx tsx prisma/seed.ts
```

## Troubleshooting

### Common Issues

#### 1. "Environment variable not found: DATABASE_URL"

**Solution**: Make sure the environment variable is set

```bash
# PowerShell
$env:DATABASE_URL="your_connection_string"

# Or create .env file with:
DATABASE_URL="your_connection_string"
```

#### 2. "No such host is known" / Connection timeout

**Possible causes**:

- MongoDB server is not running
- Hostname `my-coach-db-mqd-service` is not resolvable from your machine
- Network connectivity issues
- Firewall blocking the connection

**Solutions**:

- Verify MongoDB server is running and accessible
- Try using `localhost` instead of the service name if running locally
- Check if you need to use a different connection string for local development
- Ensure the port 27017 is accessible

#### 3. Authentication errors

**Solution**: Verify username and password in the connection string

### Local Development Database

If you're developing locally, you might want to use a local MongoDB instance:

```bash
# Local MongoDB connection string example
DATABASE_URL="mongodb://localhost:27017/mycoach"
```

Or use MongoDB Atlas for cloud database:

```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/mycoach"
```

## Seed Script Features

- **Safe execution**: Clears existing data before seeding
- **Realistic data**: Creates meaningful relationships between users, coaches, and sessions
- **Progress tracking**: Shows detailed progress during execution
- **Error handling**: Comprehensive error reporting
- **Data validation**: Ensures all required relationships are properly created

## Post-Seed Verification

After running the seed, you can verify the data was created by:

1. **Using the health check endpoint**:

   ```
   GET http://localhost:3000/api/health
   ```

2. **Checking individual endpoints**:

   ```
   GET http://localhost:3000/api/users
   GET http://localhost:3000/api/coaches
   GET http://localhost:3000/api/sessions
   ```

3. **Using Prisma Studio** (if installed):
   ```bash
   npx prisma studio
   ```

## Next Steps

After seeding:

1. Test the API endpoints with the sample data
2. Use the sample coach and client accounts for development
3. Test the session booking and review functionality
4. Modify the seed data as needed for your specific development requirements

The seed script can be run multiple times - it will clear existing data and recreate everything fresh each time.
