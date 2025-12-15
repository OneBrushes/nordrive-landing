## Cómo añadir y usar imágenes (GitHub Pages)

1) **Dónde guardar**
   - Coloca todas las imágenes en `public/`. Ejemplos:
     - `public/Logo.png`
     - `public/fotoperfilguille.webp`
     - `public/blog/mi-portada.webp`
   - En Pages se servirán en `https://<usuario>.github.io/<repo>/<archivo>`.

2) **Referenciarlas en el código (importante para Pages)**
   - Usa el helper `withBasePath` para que funcionen con el `basePath` del repo:
     ```tsx
     import { withBasePath } from "@/lib/utils"

     <img src={withBasePath("/Logo.png")} alt="Logo" />
     ```
   - Para portadas del blog en `content/blog/posts.ts`:
     ```ts
     cover: "/blog/mi-portada.webp"
     ```
     (El componente ya aplica `withBasePath` al renderizar.)

3) **Formatos y peso**
   - Prefiere `.webp` o `.avif` para fondos y fotos grandes.
   - Mantén anchura moderada (ej. 1600px máx) y comprime para reducir tamaño.

4) **Cache y nombres**
   - Si sustituyes un archivo con el mismo nombre, Pages puede cachearlo. Cambia el nombre (por ej. `logo-v2.png`) si no ves el cambio tras desplegar.

5) **Añadir nuevas imágenes al equipo o testimonios**
   - Equipo: edita `components/team-section.tsx` y añade un objeto al array:
     ```ts
     {
       name: "Nombre",
       role: "Rol",
       desc: "Descripción corta",
       image: "/ruta-en-public.webp",
     }
     ```
   - Testimonios: edita `components/testimonials-section.tsx`, array `testimonials`, `image: "/ruta-en-public.jpg"`.

6) **Recomendación para blogs**
   - Crea una carpeta `public/blog/` y guarda las portadas ahí.
   - Usa nombres simples en minúsculas y sin espacios: `public/blog/ahorro-importacion.webp`.

7) **Desplegar después de subir imágenes**
   - Haz commit/push a `master`.
   - Ejecuta el workflow “Deploy to GitHub Pages”.
   - Verifica en `https://<usuario>.github.io/<repo>/` que se ven las nuevas imágenes.

