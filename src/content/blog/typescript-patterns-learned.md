---
title: "TypeScript Patterns I Wish I Knew Earlier"
date: "2026-04-25"
tags: ["TypeScript", "Best Practices"]
excerpt: "16 years of coding taught me patterns the hard way. Here are the TypeScript techniques that would have saved me hundreds of hours of refactoring."
---

# TypeScript Patterns I Wish I Knew Earlier

After 16 years of software development—most of it before TypeScript existed—I've learned that good type design prevents bugs better than any amount of testing.

This post covers the TypeScript patterns I wish someone had taught me earlier. Each one solved a real problem I encountered in production code.

## Pattern 1: Branding for Primitive Types

**Problem**: All strings are the same type. `UserId` and `Email` are both `string`, but mixing them causes bugs.

**Solution**: Brand primitive types.

```typescript
// Before: Easy to mix up
function getUser(userId: string) { ... }
getUser(userEmail); // Compiles, but wrong!

// After: Branded types
type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(userId: UserId) { ... }

// Usage
const userId = createUserId("123");
getUser(userId); // ✅
getUser("123" as Email); // ❌ Type error
```

**Real-world example**:
```typescript
// In our ERP system
type EmployeeId = string & { readonly brand: unique symbol };
type DepartmentId = string & { readonly brand: unique symbol };
type PayrollBatchId = string & { readonly brand: unique symbol };

function processPayroll(batchId: PayrollBatchId, employeeId: EmployeeId) { ... }

// Can't accidentally swap parameters
processPayroll(employeeId, batchId); // ❌ Type error
```

## Pattern 2: Discriminated Unions for State Machines

**Problem**: Component state with multiple mutually exclusive states.

**Solution**: Discriminated unions.

```typescript
// Before: Unclear which fields exist
interface ApiState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: any;
  error?: Error;
}

// Have to check status before accessing data/error
if (state.status === 'success' && state.data) { ... }

// After: Discriminated union
type ApiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Transaction[] }
  | { status: 'error'; error: Error };

// TypeScript knows what exists based on status
function render(state: ApiState) {
  switch (state.status) {
    case 'idle':
      return <EmptyState />;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <DataTable data={state.data} />; // ✅ data exists
    case 'error':
      return <ErrorMessage error={state.error} />; // ✅ error exists
  }
}
```

**Real-world example**:
```typescript
// Payroll processing state
type PayrollState =
  | { status: 'draft'; employees: Employee[] }
  | { status: 'calculating'; progress: number }
  | { status: 'review'; summary: PayrollSummary }
  | { status: 'approved'; batchId: string }
  | { status: 'paid'; paymentRef: string };

function PayrollDashboard({ state }: { state: PayrollState }) {
  if (state.status === 'calculating') {
    return <ProgressBar value={state.progress} />;
  }
  
  if (state.status === 'review') {
    return <ReviewTable summary={state.summary} />;
  }
  
  // ... TypeScript ensures we handle all cases
}
```

## Pattern 3: Utility Types for API Responses

**Problem**: Backend and frontend types drift apart.

**Solution**: Derive frontend types from backend contract.

```typescript
// Backend entity (database model)
interface User {
  id: string;
  email: string;
  password: string; // Never send to frontend!
  createdAt: Date;
  updatedAt: Date;
}

// Frontend types derived from backend
type UserPublic = Omit<User, 'password'>;
type UserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UserUpdate = Partial<Omit<UserCreate, 'email'>>;

// API response types
type ApiResponse<T> = {
  data: T;
  timestamp: string;
};

type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

// Usage
async function getUsers(): Promise<PaginatedResponse<UserPublic>> { ... }
async function createUser(user: UserCreate): Promise<ApiResponse<UserPublic>> { ... }
```

**Advanced**: Make it stricter with `Readonly`:

```typescript
type ReadonlyUser = Readonly<UserPublic>;

function processUser(user: ReadonlyUser) {
  user.email = 'new@email.com'; // ❌ Error: Cannot assign to 'email'
}
```

## Pattern 4: Template Literal Types for Validation

**Problem**: String enums that should follow a pattern.

**Solution**: Template literal types.

```typescript
// Before: String enum, any value possible
type Currency = 'BHD' | 'USD' | 'EUR' | 'GBP';

// After: Template literal for patterns
type IsoCurrency = `${'A' | 'B' | 'D' | 'E' | 'G' | 'U'}${string}${string}`;

// Even better: Exact union
type Currency = 'BHD' | 'USD' | 'EUR' | 'GBP';

// For more complex patterns
type EventName = `user:${'created' | 'updated' | 'deleted'}`;
// Valid: "user:created", "user:updated", "user:deleted"
// Invalid: "user:modified", "product:created"

type HttpMethod = `${'GET' | 'POST' | 'PUT' | 'DELETE'}`;
type Endpoint = `/api/${'users' | 'transactions'}/${string}`;
// Valid: "/api/users/123", "/api/transactions/456"
```

**Real-world example**:
```typescript
// ERP module routing
type ModuleRoute = 
  | `/payroll/${'employees' | 'batches' | 'reports'}/${string}`
  | `/accounting/${'ledger' | 'invoices' | 'reports'}/${string}`
  | `/inventory/${'items' | 'warehouses' | 'transfers'}/${string}`;

function navigate(route: ModuleRoute) { ... }

navigate('/payroll/employees/123'); // ✅
navigate('/payroll/unknown/123'); // ❌
```

## Pattern 5: Conditional Types for API Transformations

**Problem**: Different shapes for different API operations.

**Solution**: Conditional types.

```typescript
// Base entity
interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transform for API responses
type ApiField<T> = T extends Date ? string : T;
type ApiEntity<T extends Entity> = {
  [K in keyof T]: ApiField<T[K]>;
};

// Usage
interface Employee extends Entity {
  name: string;
  salary: number;
  hireDate: Date;
}

type EmployeeApi = ApiEntity<Employee>;
// {
//   id: string;
//   createdAt: string;  // Date → string
//   updatedAt: string;  // Date → string
//   name: string;
//   salary: number;
//   hireDate: string;   // Date → string
// }
```

**Advanced**: Make fields optional based on operation:

```typescript
type UpdatePayload<T> = {
  [K in keyof T]?: T[K];
} & { id: string }; // id always required

type CreatePayload<T> = Omit<UpdatePayload<T>, 'id' | 'createdAt' | 'updatedAt'>;
```

## Pattern 6: Type Guards for Runtime Validation

**Problem**: TypeScript types don't exist at runtime. API responses need validation.

**Solution**: Type guards that validate.

```typescript
// Type guard function
function isEmployee(data: unknown): data is Employee {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    typeof (data as any).id === 'string' &&
    typeof (data as any).name === 'string'
  );
}

// Usage
async function fetchEmployee(id: string): Promise<Employee> {
  const response = await fetch(`/api/employees/${id}`);
  const data = await response.json();
  
  if (!isEmployee(data)) {
    throw new Error('Invalid employee data');
  }
  
  return data;
}
```

**Better**: Use a validation library with TypeScript:

```typescript
import { z } from 'zod';

const EmployeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  salary: z.number().positive(),
  hireDate: z.string().transform(s => new Date(s)),
});

type Employee = z.infer<typeof EmployeeSchema>;

// Runtime validation + type inference
function validateEmployee(data: unknown): Employee {
  return EmployeeSchema.parse(data);
}
```

## Pattern 7: Generic Constraints for Reusable Components

**Problem**: Components that work with different entity types.

**Solution**: Generic constraints.

```typescript
// Base interface all entities must satisfy
interface BaseEntity {
  id: string;
  createdAt: Date;
}

// Generic component
function DataTable<T extends BaseEntity>({
  data,
  columns,
  renderRow,
}: {
  data: T[];
  columns: (keyof T)[];
  renderRow: (item: T) => React.ReactNode;
}) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={String(col)}>{String(col)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(renderRow)}
      </tbody>
    </table>
  );
}

// Usage
interface Employee extends BaseEntity {
  name: string;
  department: string;
}

<DataTable<Employee>
  data={employees}
  columns={['name', 'department']}
  renderRow={(emp) => (
    <tr>
      <td>{emp.name}</td>
      <td>{emp.department}</td>
    </tr>
  )}
/>
```

## Pattern 8: Mapped Types for Dynamic Shapes

**Problem**: Need to transform all properties of a type.

**Solution**: Mapped types.

```typescript
// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Make all properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Transform all properties to async versions
type Asyncify<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[K];
};

// Usage
interface SyncService {
  getUser(id: string): User;
  createUser(data: UserCreate): User;
}

type AsyncService = Asyncify<SyncService>;
// {
//   getUser(id: string): Promise<User>;
//   createUser(data: UserCreate): Promise<User>;
// }
```

**Real-world example**:
```typescript
// Form state from entity
type FormState<T> = {
  [K in keyof T]: T[K] extends Date 
    ? string  // Dates become ISO strings in forms
    : T[K] extends (infer U)[]
    ? U[]  // Arrays stay arrays
    : T[K] | '';  // Other fields can be empty string
};

type EmployeeForm = FormState<Employee>;
// {
//   id: string;
//   name: string | '';
//   email: string | '';
//   hireDate: string;  // Date → string
//   skills: string[];  // Array stays array
// }
```

## Pattern 9: Const Assertions for Narrow Types

**Problem**: Arrays and objects widen to generic types.

**Solution**: `as const` assertions.

```typescript
// Before: Widened types
const roles = ['admin', 'user', 'guest'];
// Type: string[]

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
// Type: { apiUrl: string; timeout: number }

// After: Narrow types with as const
const roles = ['admin', 'user', 'guest'] as const;
// Type: readonly ["admin", "user", "guest"]

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;
// Type: { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000 }

// Extract types
type Role = typeof roles[number]; // "admin" | "user" | "guest"
type ApiUrl = typeof config.apiUrl; // "https://api.example.com"
```

**Real-world example**:
```typescript
// API error codes
const ERROR_CODES = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  VALIDATION: 400,
} as const;

type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

function handleError(code: ErrorCode) {
  // Only accepts specific error codes
}

handleError(404); // ❌
handleError(ERROR_CODES.NOT_FOUND); // ✅
```

## Pattern 10: Type-Safe Event Emitters

**Problem**: Event systems with string-based event names are error-prone.

**Solution**: Type-safe event maps.

```typescript
// Define event map
interface AppEvents {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string };
  'payroll:processed': { batchId: string; employeeCount: number };
  'error': { code: number; message: string };
}

// Type-safe event emitter
class TypedEventEmitter {
  private listeners: {
    [K in keyof AppEvents]?: Array<(data: AppEvents[K]) => void>;
  } = {};
  
  on<K extends keyof AppEvents>(
    event: K,
    callback: (data: AppEvents[K]) => void
  ) {
    this.listeners[event]?.push(callback) ?? 
      (this.listeners[event] = [callback]);
  }
  
  emit<K extends keyof AppEvents>(event: K, data: AppEvents[K]) {
    this.listeners[event]?.forEach(cb => cb(data));
  }
}

// Usage
const emitter = new TypedEventEmitter();

emitter.on('user:login', (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

emitter.emit('user:login', { userId: '123', timestamp: new Date() }); // ✅
emitter.emit('user:login', { userId: '123' }); // ❌ Missing timestamp
emitter.emit('unknown:event', {}); // ❌ Unknown event
```

## Key Takeaways

1. **Brand primitive types** to prevent mixing incompatible values
2. **Use discriminated unions** for state machines
3. **Derive types from single source of truth** (backend contracts)
4. **Template literals** for pattern validation
5. **Type guards** for runtime validation
6. **Generics with constraints** for reusable components
7. **Mapped types** for systematic transformations
8. **Const assertions** for narrow, literal types
9. **Type-safe events** prevent string-based bugs

---

*What TypeScript patterns have saved you? Share on [GitHub](https://github.com/vimalgovind143) or [LinkedIn](https://linkedin.com/in/vimalgovind/).*
