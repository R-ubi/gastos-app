# 💰 Mis Finanzas: conclusiones y aprendizajes

**Autor:** Ricardo Fragoso Ayala

## 🔗 Enlaces

- **App funcionando:** https://my-finanzas-55.netlify.app
- **Repositorio:** https://github.com/R-ubi/gastos-app
- **Versión de prueba (rama `prueba`):** https://prueba--my-finanzas-55.netlify.app

## 📱 Qué construí

Una app para registrar gastos e ingresos personales, hecha con React Native + Expo y exportada a web.

- **Cuenta de usuario:** crear cuenta (con nombre), iniciar sesión, cerrar sesión y recuperar contraseña por correo.
- **Movimientos:** agregar ingresos o gastos con monto, descripción y fecha, con validaciones.
- **Balance:** balance total (ingresos − gastos) con el desglose de ambos.
- **Historial:** lista de movimientos desde Supabase, con filtros y opción de eliminar.
- **Todo se guarda en Supabase.** Cada usuario solo ve sus propios movimientos gracias a **Row Level Security (RLS)**.

| Parte | Herramienta |
|---|---|
| App | React Native + Expo (exportada a web) |
| Base de datos y usuarios | Supabase |
| Repositorio y CI/CD | GitHub + GitHub Actions |
| Hosting | Netlify |

## 🤖 Herramientas de IA que usé

- Claude: fue mi guía principal. Me explicó cada herramienta nueva comparándola con lo que yo ya conocía (PHP, MySQL, XAMPP), generó el código que después probé y ajusté, y me ayudó a interpretar los errores a partir de capturas de pantalla.
- Gemini: como apoyo adicional para resolver dudas.

## 🧗 Lo que más me costó y cómo lo resolví

### 1. Aprender a usar aplicaciones nuevas sobre la marcha
El código se me hacía familiar porque vengo de PHP, Python y MySQL. El verdadero reto fueron **las aplicaciones nuevas**: Supabase, Expo, GitHub Actions y Netlify, cada una con su propia interfaz y lógica.

**Cómo lo resolví:** avancé por partes, sin saltarme pasos. Cuando algo no me quedaba claro, me apoyaba en la IA compartiéndole capturas de pantalla y lo investigaba. Relacionar cada herramienta con algo que ya conocía me ayudó mucho: Supabase es como un MySQL + phpMyAdmin en la nube, y el `.env` es como mi `conexion.php`.

### 2. Bloqueos que resolví

| Problema | Causa | Solución |
|---|---|---|
| GitHub Actions falló con `Unauthorized` | El token de Netlify estaba mal copiado | Generar un token nuevo y actualizar el secreto en GitHub |
| Pantalla blanca tras el despliegue (`Invalid supabaseUrl`) | El secreto con la URL de Supabase tenía un valor incorrecto | Corregir el secreto y volver a ejecutar el workflow |
| No veía la tabla en Supabase | La ventana angosta escondía el menú | Maximizar la ventana |
| PowerShell bloqueaba `npx` | Política de ejecución de scripts de Windows | Usar la terminal Command Prompt en VS Code |
| Montos con formato europeo (`14.750,00 $`) | El traductor del navegador cambiaba el formato | Escribir el formato de dinero sin depender del idioma del navegador |
| La app pedía iniciar sesión de Netlify en el celular | La app estaba como privada en Netlify | Cambiar la visibilidad del proyecto a pública |

## 🌱 Aprendizajes

Aprendí muchísimo. Lo que más me gustó fue **subir mi aplicación a la red**: se la enseñé a mi familia e incluso pensamos usarla para llevar un mejor control de nuestras finanzas.

Cuando algo no lo entendía, lo investigaba, y al leer la definición me sorprendía su significado, como descubrir qué es Supabase y todo lo que resuelve por sí solo. **Aprender me causa satisfacción**, y este reto me demostró que puedo entender herramientas nuevas y resolver los bloqueos de principio a fin.

## 🛠️ Cómo correrlo localmente

1. Clonar el repositorio y ejecutar `npm install`.
2. Crear un archivo `.env` con `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
3. Ejecutar `npx expo start --web`.