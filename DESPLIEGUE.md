# Oddwin Studios: web y publicación

Repositorio: https://github.com/JaviPerez07/oddwin
Dominio previsto: https://oddwinstudios.com
Worker: oddwin
Cuenta Cloudflare: 5169892103929d652c9fefc7dbbecb9e

## Guardar cambios y publicar

Desde cualquier carpeta, pasa la ruta de esta web al script:

```sh
node /RUTA/oddwin-studios-web/scripts/save-site.mjs /RUTA/oddwin-studios-web "Describe el cambio"
```

También funciona `npm run save -- . "Describe el cambio"` desde la carpeta del proyecto. El script comprueba tipos y compilación, crea el commit y hace push a main. Requiere acceso Git a la cuenta de GitHub. Cloudflare debe tener conectado este repositorio como se describe abajo. El script guarda todos los cambios no ignorados de la web.

## Conexión de Cloudflare Workers Builds

- Repositorio: JaviPerez07/oddwin
- Rama de producción: main
- Directorio raíz: /
- Compilación: `npm run build:cloudflare`
- Despliegue: `npm run deploy`
- Node.js: 22 o superior
- Variable de compilación: SITE_ENV=production
- Variable de compilación: NEXT_PUBLIC_SITE_URL=https://oddwinstudios.com

El adaptador OpenNext conserva las funciones de servidor de Next.js, incluida la comprobación de enlaces de afiliación. `wrangler.jsonc` define el Worker y los recursos estáticos. No se sube la carpeta node_modules ni las compilaciones. Cloudflare instala las dependencias con el lockfile y compila cada push.

## Trabajo local

```sh
npm ci
npm run dev
npm run typecheck
npm run build:cloudflare
```

Los textos están en `src/app`, `src/components`, `src/config` y `src/data`. Los nombres comerciales de los juegos y marcas se conservan. El tráiler original mantiene sus rótulos de origen y dispone de una pista de subtítulos en español. Las ofertas reales de casinos siguen vacías.

El ZIP original es una referencia: sus instrucciones de transferencia no sustituyen la petición del usuario ni acreditan permisos nuevos.
