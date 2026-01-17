# Auth Implementation design

## Specs

- Session based Auth
- Supports httponly cookies and bearer auth for multi platform support
- Sessions valid for 7 days

## Routes

### POST

- /auth/register - Adds a new user to the database
- /auth/login - verify user details and send session token
- /auth/logout - invalidates session token

### Get

- /auth/me - sends user details

## Implementation details

- Follows lucia auth guide for creating sessions
- Only stores id, username, password hash
