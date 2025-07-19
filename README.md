# Link Shortener Service - NestJS + MongoDB

A production-ready URL shortening service built with **NestJS**, **MongoDB**, and **JWT Authentication**. This service enables users to shorten long URLs, track analytics, and manage their links securely.

---

Features

###  Authentication

* **POST /auth/signup**: Register a new user
* **POST /auth/login**: Authenticate and receive JWT token

###  Links

* **POST /links/shorten**: Create a shortened URL (authenticated)
* **GET /\:shortCode**: Redirect to the original long URL
* **GET /links/\:shortCode/stats**: View analytics for a specific link (authenticated & authorized)

###  Analytics

* Each redirect captures:

  * Timestamp
  * IP address
  * Referrer
  * User-Agent
  * Country (if available)

###  Security

* JWT-based authentication
* Role-based access control (for stats)
* Input validation using DTOs

###  High Performance

* Artillery testing script provided to simulate **10,000+** requests
* Indexes in MongoDB for optimized lookup

---

##  Tech Stack

* **Backend**: NestJS
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JWT (Bearer Token)
* **Testing**: Jest (Unit + E2E), Artillery

---

##  MongoDB Indexing

```ts
@Schema()
export class Link {
  @Prop({ required: true, index: true })
  shortCode: string;

  @Prop({ required: true })
  longUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ index: true })
  createdBy: string; // User ID

  @Prop({ type: [AnalyticsSchema], default: [] })
  analytics: Analytics[];
}
```

Indexes are created on `shortCode` and `createdBy` for fast lookup and stat retrieval.

---

##  Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-org/link-shortener
cd link-shortener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/shortener
JWT_SECRET=your-secret-key
PORT=3000
```

### 4. Run the Server

```bash
npm run start:dev
```

App runs at: `http://localhost:3000`

### 5. API Test Tool (Optional)

Import `postman_collection.json` from `/docs/postman` folder into Postman.

---

##  Testing

### Unit & E2E Tests

```bash
# Run all tests
npm run test

# Run e2e tests
npm run test:e2e
```

### Artillery Load Testing

Install globally:

```bash
npm install -g artillery
```

Run load test:

```bash
artillery run load-test.yml
```

This simulates **10,000+ requests** to:

* `POST /auth/signup`
* `POST /auth/login`
* `POST /links`
* `GET /:shortCode`
* `GET /links/:shortCode/stats`

Refer `load-test.yml` file in root directory for scenarios.

---

##  Authenticated Endpoint Example

**GET /links/\:shortCode/stats**

Only the creator of the link can view its analytics.
Send the JWT in the header:

```http
Authorization: Bearer <token>
```

Example cURL:

```bash
curl -H "Authorization: Bearer eyJhbGci..." http://localhost:3000/links/m6ecZl/stats
```

---

##  Folder Structure

```
src/

├── links/              # Link & analytics logic
├── users/              # User model & service
├── app.module.ts       # Root module
├── main.ts             # App bootstrap
```

---

##  Scalability & Deployment


* MongoDB indexes for read/write efficiency
* Artillery-tested for high load
* JWT + role-based access for security

---


