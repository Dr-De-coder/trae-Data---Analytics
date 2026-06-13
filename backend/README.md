# Data Analytics Backend

AI-powered data analytics platform that converts natural language to SQL queries.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables in `.env`

3. Run the server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/query` - Process natural language query

## Project Structure

```
backend/
├── src/
│   ├── server.js
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── database/
│   ├── prompts/
│   ├── middlewares/
│   ├── utils/
│   └── config/
├── .env
├── package.json
└── README.md
```
