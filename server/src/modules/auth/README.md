# Auth Implementation design

## Specs

- Session based Auth
- Supports httponly cookies and bearer auth for multi platform support
  
## Routes

### POST

- /auth/register - Adds a new user to the database
- /auth/login - verify user details and send session token
- /auth/logout - invalidates session token
- /auth/refresh - returns new session token

### Get

- /auth/me - sends user details
