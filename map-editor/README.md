# Tanks Map Editor

Standalone browser editor for creating stage layouts for the Tanks game.

## Features

- Paint a 20 x 20 map grid.
- Place trees, rocks, and ammo pickups.
- Add one-cell collision areas.
- Choose an existing stage background.
- Undo edits with `Ctrl+Z`.
- Toggle the grid with `G`.
- Export and import stage JSON.

## Run

Open `index.html` in a browser. A local server is recommended when loading background images, for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/map-editor/` from the project root.

## Export format

The exported JSON includes `background`, `objects`, and `colliders`. Object positions are canvas coordinates. Collider rectangles use canvas coordinates and can later be mapped to the game's collision model.
