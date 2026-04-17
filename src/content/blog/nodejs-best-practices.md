---
title: "Node.js Best Practices for Production Applications"
date: "2026-04-10"
tags: ["Back End", "Node.js", "Tools"]
excerpt: "Essential best practices for building production-ready Node.js applications including error handling, security, performance optimization, and monitoring."
---

# Node.js Best Practices for Production Applications

After years of building and maintaining Node.js applications in production, here are the essential practices every developer should follow.

## 1. Error Handling

### Use Async/Await with Try-Catch

```typescript
async function getUser(id: string) {
  try {
    const user = await db.users.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    // Log and re-throw
    logger.error('Failed to fetch user', { error, userId: id });
    throw new InternalServerError('Failed to fetch user');
  }
}
```

### Centralized Error Handling

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', { error: err });
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
  });
});
```

## 2. Security Best Practices

### Use Helmet for HTTP Headers

```typescript
import helmet from 'helmet';

app.use(helmet());
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);
```

### Input Validation

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(50),
});

app.post('/users', (req, res) => {
  const result = userSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  // Process valid data
  createUser(result.data);
});
```

## 3. Performance Optimization

### Use Caching

```typescript
import Redis from 'ioredis';

const redis = new Redis();

async function getProduct(id: string) {
  const cached = await redis.get(`product:${id}`);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const product = await db.products.findById(id);
  await redis.setex(`product:${id}`, 3600, JSON.stringify(product));
  
  return product;
}
```

### Database Query Optimization

```typescript
// ❌ Bad: N+1 query problem
const users = await db.users.findAll();
for (const user of users) {
  user.posts = await db.posts.findByUserId(user.id);
}

// ✅ Good: Eager loading
const users = await db.users.findAll({
  include: ['posts'],
});
```

## 4. Logging & Monitoring

### Structured Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### Health Check Endpoint

```typescript
app.get('/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: await checkDatabaseConnection(),
    memoryUsage: process.memoryUsage(),
  };
  
  res.status(200).json(healthCheck);
});
```

## 5. Environment Configuration

```typescript
import { config } from 'dotenv';

config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
};

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}
```

## Conclusion

Following these best practices will help you build robust, secure, and performant Node.js applications. Remember: good practices are not optional in production!

What are your favorite Node.js best practices? Share them in the comments below!
