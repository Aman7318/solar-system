# Interactive 3D Solar System

A simple, interactive 3D visualization of the Solar System built with Three.js. The Sun and the eight planets orbit and spin in a 3D scene that can be explored with the mouse.

Sizes, distances and orbital speeds are simplified so that everything fits on screen and stays easy to see. They are not to scale.

## Features

- The Sun and all eight planets, with realistic surface textures
- Planets orbit the Sun and rotate around their own axes
- Visible orbit paths
- Saturn with tilted rings
- Moons that orbit their planets: Earth's Moon, Jupiter's Galilean moons (Io, Europa, Ganymede, Callisto) and Saturn's Titan
- Mouse camera controls: rotate, zoom and pan
- Planet names shown when hovering over a planet

## Planned

- Selecting a planet to view basic information about it
- Pause/resume and simulation speed controls

## Technologies

- [Three.js](https://threejs.org/) for 3D graphics (loaded from a CDN, no install needed)
- JavaScript for scene setup and animation
- HTML/CSS for the page and labels
- Git/GitHub for version control

## Running the project

The project needs to be served over a local web server, because browsers block loading textures and modules from files opened directly.

**Option 1: VS Code**

1. Install the *Live Server* extension.
2. Right-click `index.html` and choose *Open with Live Server*.

**Option 2: Python**

1. Open a terminal in the project folder.
2. Run `python -m http.server`.
3. Open `http://localhost:8000` in a browser.

## Controls

| Action | Control |
|---|---|
| Rotate | Left mouse button + drag |
| Zoom | Mouse wheel |
| Pan | Right mouse button + drag |
| Planet name | Hover over a planet |

## Project structure

```
solar-system/
├── index.html    page structure, styles and Three.js import map
├── main.js       scene, objects, animation and interaction
└── textures/     planet and Sun texture images
```

## Use of AI

AI assistants (Claude and ChatGPT) are used as support tools in this project:

- **Documentation:** helping write and structure documentation such as this README. ChatGPT is also used to add and format content on the project wiki page.
- **Unfamiliar parts:** helping with specific parts of the code that I am not sure how to implement.
- **Consistency:** in some places, keeping the code structure consistent so it is easier to extend in later milestones.

Every change is run and tested in the browser, and I adjust the results as needed, for example the planet spacing, the size of Saturn's rings and the hover labels.

## Credits

Planet and Sun textures are from [Solar System Scope](https://www.solarsystemscope.com/textures/) and are licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). The moons of Jupiter and Saturn use plain colors approximating their real appearance.