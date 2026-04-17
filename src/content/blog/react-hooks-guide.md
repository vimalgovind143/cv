---
title: "Understanding React Hooks: A Comprehensive Guide"
date: "2026-04-15"
tags: ["Front End", "React", "JavaScript"]
excerpt: "Deep dive into React Hooks - useState, useEffect, useContext, and custom hooks with practical examples and best practices."
---

# Understanding React Hooks: A Comprehensive Guide

React Hooks revolutionized how we write React components. Let's explore the most commonly used hooks and learn how to use them effectively.

## useState Hook

The `useState` hook allows you to add state to functional components.

```typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### Best Practices

1. **Initialize state lazily** when computation is expensive:

```typescript
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

2. **Use functional updates** when new state depends on previous state:

```typescript
setCount(prevCount => prevCount + 1);
```

## useEffect Hook

The `useEffect` hook handles side effects in functional components.

```typescript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

### Common Patterns

### Data Fetching

```typescript
useEffect(() => {
  let isMounted = true;
  
  fetchData().then(data => {
    if (isMounted) {
      setData(data);
    }
  });
  
  return () => {
    isMounted = false;
  };
}, []);
```

### Event Listeners

```typescript
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

## Custom Hooks

Create reusable logic by extracting it into custom hooks:

```typescript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };
  
  return [storedValue, setValue];
}
```

## Conclusion

React Hooks provide a powerful and elegant way to manage state and side effects. Master them, and you'll write cleaner, more maintainable React code.

Stay tuned for more React tips and tutorials!
