# Trekking Food API v2

NestJS API with **Better Auth** and **Prisma** (PostgreSQL).

## Stack

- **NestJS** – backend framework
- **Better Auth** – authentication (email/password, sessions)
- **Prisma** – ORM with PostgreSQL
- **@thallesp/nestjs-better-auth** – NestJS integration (guards, decorators)
- **Swagger** – OpenAPI documentation at `/docs`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy the example env and set your values:

```bash
cp .env.example .env
```

- **DATABASE_URL** – PostgreSQL connection string
- **BETTER_AUTH_SECRET** – generate with `npm run auth:secret`
- **BETTER_AUTH_URL** – your app URL (e.g. `http://localhost:3000`)

### 3. Database

Generate Prisma Client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Run

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## API documentation (Swagger)

Interactive OpenAPI docs are available at **`/docs`** when the app is running (e.g. `http://localhost:3000/docs`). Use them to explore and try endpoints.

## Auth routes

Better Auth is mounted at **`/api/auth/*`** (handled by the NestJS Better Auth module). Use the [Better Auth client](https://www.better-auth.com/docs) from your frontend to sign up, sign in, and sign out.

## Route protection

- **Global guard** – all routes require auth by default.
- **`@AllowAnonymous()`** – public route (e.g. `GET /`, `GET /users/public`).
- **`@OptionalAuth()`** – auth optional; session may be `null`.
- **`@Session()`** – inject current `UserSession` in handlers.

Example:

```ts
@Get('me')
async getProfile(@Session() session: UserSession) {
  return { user: session.user };
}
```

## API examples

### Create recipe with ingredients

Authenticated request to create a recipe (requires valid session cookie or auth header):

```http
POST /recipes
Content-Type: application/json
```

```json
{
  "name": "Buckwheat porridge",
  "categoryId": "<RecipeCategory.id>",
  "description": "Simple breakfast",
  "ingredients": [
    { "productId": "<Product.id>", "quantity": 200 },
    { "productId": "<Product.id>", "quantity": 50 }
  ]
}
```

Replace `<RecipeCategory.id>` and `<Product.id>` with real IDs from your DB (e.g. from Prisma Studio or `GET /products`). Responses include `category` and `ingredients` (with nested `product`) where relevant.

## Scripts

| Script              | Description                    |
|---------------------|--------------------------------|
| `npm run start:dev` | Start with watch mode          |
| `npm run build`     | Build for production           |
| `npm run prisma:generate` | Generate Prisma Client  |
| `npm run prisma:migrate`   | Run DB migrations       |
| `npm run prisma:studio`   | Open Prisma Studio      |
| `npm run auth:secret`     | Generate auth secret    |
