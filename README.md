# Trello Express.js Fullstack Klon

**Trello’ga o‘xshash task management ilovasi uchun fullstack (backend + frontend) yechim.** Backend Node.js, Express.js va MongoDB asosida, frontend esa React, TypeScript va Vite yordamida yaratilgan.

---

## Asosiy imkoniyatlar

- **Qatlamli backend arxitekturasi:** Model, Service, Controller, Route, Middleware’lar orqali mas’uliyatlarni aniq ajratish.
- **JWT va rolga asoslangan avtorizatsiya:** Xavfsiz API, doska egasi va a’zolar uchun alohida huquqlar.
- **RESTful API va CRUD:** Doska, ro‘yxat, kartalar uchun barcha CRUD endpointlari.
- **Markazlashgan xatoliklarni boshqarish** va **so‘rovlarni tekshirish** (validation).
- **Frontend:** Zamonaviy React + TypeScript + Vite asosida, real vaqtli UI.
- **Backend va frontend o‘zaro aloqasi:** JWT token orqali autentifikatsiya va API’dan foydalanish.
- **Samarali ma’lumotlar boshqaruvi:** Sahifalash (pagination), parallel so‘rovlar.
- **.env bilan xavfsiz sozlash.**

---

## Loyiha tuzilmasi

```
trello_express.js/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── boards/
│   │   │   ├── lists/
│   │   │   └── cards/
│   │   ├── middlewares/
│   │   ├── services/
│   │   └── server.js
│   ├── scripts/
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── README.md
```

---

## O‘rnatish va ishga tushirish

### 1. Backend (server)

```bash
cd backend
npm install
cp .env.example .env
# .env faylini tahrirlang (MongoDB va JWT secret)
npm run dev   # Dasturchilar uchun
# yoki
npm start     # Ishlab chiqarish uchun
```

### 2. Frontend (client)

```bash
cd client
npm install
npm run dev    # Lokal serverni ishga tushirish (Vite)
```

### 3. Front va backni birga ishlatish

- Avval backend, keyin frontendni ishga tushiring.
- Frontenddan API so‘rovlari uchun backend manzilini .env faylida yoki konfiguratsiyada belgilang (`VITE_API_URL=...`).

---

## API asosiy endpointlari

Barcha endpointlar uchun **Bearer Token** kerak.

| Metod  | Endpoint           | Tavsif                                         | Kim foydalanishi mumkin         |
| ------ | ------------------ | ---------------------------------------------- | ------------------------------- |
| POST   | `/api/boards`      | Yangi doska yaratish                           | Avtorizatsiyadan o‘tgan foydalanuvchi |
| GET    | `/api/boards`      | Foydalanuvchi a’zo bo‘lgan doskalar ro‘yxati   | Avtorizatsiyadan o‘tgan foydalanuvchi |
| GET    | `/api/boards/:id`  | ID orqali bitta doskani olish                  | Doska a’zosi                    |
| PUT    | `/api/boards/:id`  | Doska ma’lumotlarini yangilash                 | **Faqat doska egasi**           |
| DELETE | `/api/boards/:id`  | Doskani o‘chirish                              | **Faqat doska egasi**           |

---

## Muhit o‘zgaruvchilari

### Backend uchun
- `MONGO_URL` — MongoDB manzili
- `JWT_SECRET` — JWT uchun maxfiy so‘z

### Frontend uchun (client/.env)
- `VITE_API_URL` — API’ning backend manzili

---

## Ishlatilgan texnologiyalar

### Backend:
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **jsonwebtoken, bcryptjs, dotenv, zod, express-validator**

### Frontend:
- **React**
- **TypeScript**
- **Vite**
- **CSS/HTML**

---

## Hissa qo‘shish

Fork qiling, branch oching va pull request yuboring. Taklif va xatoliklar uchun issue ochishingiz mumkin.

---

## Litsenziya

ISC

---

> _Loyiha ta’lim va ko‘rgazmali maqsadlarda. Ishlab chiqarishga tadbiq qilishdan avval testlar, CI/CD va API hujjatlarini (Swagger yoki Postman) qo‘shish tavsiya etiladi._
