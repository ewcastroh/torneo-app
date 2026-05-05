# 🏅 Torneo Deportivo

Aplicación web para gestionar torneos deportivos de 32 jugadores con fase de grupos, repechaje y eliminatoria directa.

**Demo en vivo:** [ewcastroh.github.io/torneo-app](https://ewcastroh.github.io/torneo-app/)

---

## Estructura del torneo

```
32 jugadores
    │
    ▼
┌─────────────────────────────┐
│       FASE DE GRUPOS        │
│  8 grupos de 4 jugadores    │
│  1° vs 3° · 2° vs 4°        │
└──────────┬──────────────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
 2 ganadores  2 perdedores
 por grupo    por grupo
     │           │
     ▼           ▼
┌─────────┐ ┌──────────┐
│16 clasi-│ │REPECHAJE │
│ficados  │ │16 jugad. │
│directos │ │bracket de│
│         │ │consolac. │
└────┬────┘ └──────────┘
     │
     ▼
┌─────────────────────────────┐
│        ELIMINATORIA         │
│  Octavos · Cuartos · Semis  │
│          Final              │
└──────────┬──────────────────┘
           │
           ▼
        🏆 CAMPEÓN
```

## Características

- **Ingreso de jugadores** — 32 participantes con nombre del torneo y deporte
- **Grupos aleatorios** — 8 grupos de 4, sorteados automáticamente al iniciar
- **Fase de grupos** — 2 partidos por grupo (1° vs 3° y 2° vs 4°); tabla de clasificación en tiempo real
- **Repechaje** — bracket de eliminación para los 16 jugadores que no clasificaron directamente
- **Eliminatoria** — octavos, cuartos, semifinales y final para los 16 clasificados directos
- **Pantalla de campeón** — celebración animada al finalizar el torneo
- **Persistencia** — el estado se guarda en `localStorage`; refrescar la página no pierde el progreso
- **Nuevo torneo** — botón para reiniciar desde cualquier fase

## Tecnologías

- [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- CSS puro (sin librerías de UI)
- `localStorage` para persistencia del estado

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`.

```bash
# Build de producción
npm run build

# Previsualizar el build
npm run preview
```

## Despliegue

El proyecto se despliega automáticamente en **GitHub Pages** mediante GitHub Actions cada vez que se hace push a la rama `main`.

El workflow está definido en [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
