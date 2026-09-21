# Travel India — REST API Reference

All API routes are prefixed with `/api`.

## 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new customer account | No |
| `POST` | `/api/auth/login` | Authenticate customer/admin & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |
| `PUT` | `/api/auth/profile` | Update profile details & emergency contact | Yes (Bearer) |
| `POST` | `/api/auth/forgot-password`| Request password reset | No |
| `POST` | `/api/auth/reset-password` | Reset password with token | No |

## 2. Tours & Catalog (`/api/tours`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tours` | Search, filter, and paginate tours | No |
| `GET` | `/api/tours/:slug` | Get full package details, itinerary & reviews | No |
| `GET` | `/api/tours/categories` | List all tour categories with package counts | No |
| `GET` | `/api/tours/featured` | List featured bestseller packages | No |

### Query Parameters for `GET /api/tours`:
- `search`: Keyword matching title, destination, or tagline
- `destination`: Destination ID or slug
- `category`: Category ID or slug
- `departureCity`: Filter by starting city
- `minPrice` / `maxPrice`: Numerical price boundaries
- `duration`: `1` (day tour), `2-3` (weekend), `4+` (long tour)
- `sort`: `recommended`, `price_asc`, `price_desc`, `rating`, `newest`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)

## 3. Destinations (`/api/destinations`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/destinations` | List all active destinations | No |
| `GET` | `/api/destinations/:slug` | Destination details & associated tours | No |

## 4. Bookings (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Create new booking & initialize payment order | Yes |
| `GET` | `/api/bookings` | List customer bookings | Yes |
| `GET` | `/api/bookings/:id` | Get printable boarding pass & receipt data | Yes |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking & trigger 100% refund | Yes |
| `POST` | `/api/bookings/validate-coupon` | Validate coupon and calculate discount | Yes |

## 5. Payments (`/api/payments`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create` | Create payment order | Yes |
| `POST` | `/api/payments/verify` | Verify payment and confirm booking | Yes |
| `GET` | `/api/payments/:id` | Fetch payment status | Yes |

## 6. Enquiries & Custom Trip Planner (`/api/enquiries`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/enquiries` | Submit general or 10-step A-to-Z custom trip enquiry | No |
| `GET` | `/api/enquiries/my` | Track customer custom trip enquiries | Yes |

## 7. Administrative Console (`/api/admin`)
*Requires `ADMIN` or `STAFF` role.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | KPI counters (revenue, bookings, customers) |
| `GET` | `/api/admin/reports` | Analytics on popular tours, destinations & revenue |
| `GET` | `/api/admin/tours` | List all tours for management |
| `POST` | `/api/admin/tours` | Create new tour package |
| `PUT` | `/api/admin/tours/:id` | Update tour package details |
| `DELETE` | `/api/admin/tours/:id` | Soft-delete / archive tour package |
| `GET` | `/api/admin/bookings` | Manage customer bookings & change statuses |
| `GET` | `/api/admin/customers` | View customer directory & spending |
| `GET` | `/api/admin/payments` | Audit payment transactions |
| `GET` | `/api/admin/enquiries` | Manage custom trip lead pipeline |
| `PUT` | `/api/admin/reviews/:id/moderate` | Approve or reject customer reviews |
| `GET` | `/api/admin/coupons` | List promo coupons |
| `POST` | `/api/admin/coupons` | Create new promo coupon |

