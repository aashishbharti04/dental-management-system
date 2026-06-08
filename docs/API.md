# API Reference

All endpoints live under `/api` and exchange JSON. Authentication uses the session cookie
set at login (sent automatically by the browser).

## Conventions

**Success** responses use a `data` envelope:

```json
{ "data": { "...": "..." } }
```

**Error** responses use an `error` envelope:

```json
{ "error": { "message": "Human-readable message", "details": { "field": ["..."] } } }
```

| Status | Meaning                                          |
| ------ | ------------------------------------------------ |
| `200`  | OK                                               |
| `201`  | Created                                          |
| `401`  | Not authenticated                                |
| `404`  | Not found                                        |
| `409`  | Conflict (e.g. username taken)                   |
| `422`  | Validation failed (`details` holds field errors) |
| `429`  | Too many requests (rate limited)                 |

---

## Auth

### `POST /api/auth/login`

Body: `{ "username": string, "password": string }`
Sets the session cookie and returns the user.

```json
{ "data": { "user": { "id": 1, "username": "admin" } } }
```

Errors: `401` invalid credentials, `422` validation, `429` rate limited.

### `POST /api/auth/logout`

Clears the session cookie. Returns `{ "data": { "ok": true } }`.

### `GET /api/auth/register`

Returns whether open (first-admin) registration is still available:

```json
{ "data": { "bootstrap": true } }
```

### `POST /api/auth/register`

Body: `{ "username": string, "password": string }` (password ≥ 8 chars).
Creates an account. The **first** account is created openly and signed in automatically;
afterwards an authenticated session is required.

Errors: `401` registration closed, `409` username taken, `422` validation.

---

## Patients

> All patient endpoints require authentication.

### `GET /api/patients?q=<term>`

Lists patients, optionally filtered by name or doctor.

```json
{
  "data": {
    "patients": [
      {
        "id": 1,
        "patient_name": "Jane Doe",
        "age": 34,
        "doctor_consulted": "Dr. Smith",
        "address": "12 Main St",
        "phone_number": "+91 98765 43210",
        "created_at": "2026-06-08T10:00:00.000Z"
      }
    ]
  }
}
```

### `POST /api/patients`

Body:

```json
{
  "patient_name": "Jane Doe",
  "age": 34,
  "doctor_consulted": "Dr. Smith",
  "address": "12 Main St",
  "phone_number": "+91 98765 43210"
}
```

Returns `201` with `{ "data": { "patient": { ... } } }`.

### `GET /api/patients/:id`

Returns a single patient, or `404`.

### `DELETE /api/patients/:id`

Deletes a patient. Returns `{ "data": { "deleted": true } }`, or `404` if it didn't exist.

---

## Staff

> All staff endpoints require authentication.

### `GET /api/staff?q=<term>`

Lists staff/salary records, optionally filtered by name or profession.

### `POST /api/staff`

Body:

```json
{
  "employee_name": "John Roe",
  "profession": "Hygienist",
  "salary_amount": 25000,
  "address": "5 Oak Rd",
  "phone_number": "+91 90000 00000"
}
```

Returns `201` with `{ "data": { "staff": { ... } } }`.

### `DELETE /api/staff/:id`

Deletes a staff record. Returns `{ "data": { "deleted": true } }`, or `404`.
