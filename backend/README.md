# RecipeHub Backend (Node.js + MySQL)

## 1) Setup
1. Copy `.env.example` to `.env`
2. Update DB and JWT values
3. Run SQL file in phpMyAdmin:
   - `backend/migration/001_init_recipehub_auth.sql`
4. Install dependencies:
   - `npm install`
5. Start server:
   - `npm run dev`

Server default URL: `http://localhost:4000`

## 2) Auth Rules
- Admin, Customer, and Staff accounts are stored in MySQL `users` table.
- Default seeded admin credential:
   - email: `admin@gmail.com`
   - password: `admin1234`

## 3) API Endpoints
- `POST /api/auth/login`
- `POST /api/auth/register/customer`
- `GET /api/auth/me` (Bearer token)
- `POST /api/admin/staff` (Admin token required)

### Recipe API
- `GET /api/recipes/categories`
- `GET /api/recipes`
- `GET /api/recipes/:recipeId`
- `POST /api/recipes` (Staff/Admin token required, multipart/form-data)
- `PATCH /api/recipes/:recipeId/status` (Admin token required)
- `POST /api/recipes/:recipeId/favorite` (Token required)
- `POST /api/recipes/:recipeId/like` (Token required)
- `POST /api/recipes/:recipeId/comments` (Token required)
- `DELETE /api/recipes/:recipeId/comments/:commentId` (Token required)

### Recipe Image Upload
- Field name: `imageFile`
- Accepted type: image files only
- Max size: 5MB
- Stored on server at: `backend/uploads/recipes`
- Public URL format: `http://localhost:4000/uploads/recipes/<filename>`

### Sample Login Body
```json
{
  "role": "admin",
   "identifier": "admin@gmail.com",
   "password": "admin1234"
}
```

For all roles, `identifier` should be the account email.
