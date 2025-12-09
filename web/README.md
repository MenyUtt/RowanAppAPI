# Frontend de login (simple)

Archivos estáticos para probar el login contra la API de `RowanAppAPI`.

Instrucciones rápidas:

- Asegúrate de que tu API (NestJS) está corriendo (por defecto en `http://localhost:3000`).
- Si usas CORS en la API, permite el origen donde abras estos archivos (ej. `http://localhost:5500`).
- Puedes abrir `web/index.html` directamente en el navegador o usar un servidor estático simple:

```powershell
npx serve web -l 5500
```

- Ajusta `API_BASE` en `web/app.js` si tu API corre en otro host/puerto.

Flujo implementado:
- Paso 1: POST `/auth/login-step1` con `{ correo, contrasena }` — devuelve `userId` y mensaje.
- Paso 2: POST `/auth/login-verify-2fa` con `{ userId, code }` — devuelve token JWT.
- El token se guarda en `localStorage` como `jwt` y se usa para GET `/auth/me`.
