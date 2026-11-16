**Input** — labelled text field for forms (event creation, checkout, auth). Overline label, signal-lime focus glow, optional glass ground.

```jsx
<Input label="Email" type="email" placeholder="correo@ejemplo.com" />
<Input label="Nombre del evento" placeholder="Ej: Noche de electrónica" hint="Como aparecerá en la página" />
<Input label="Contraseña" type="password" error="Email o contraseña incorrectos" />
<Input label="Descripción" multiline rows={4} />
<Input label="Email" glass placeholder="correo@ejemplo.com" />   {/* over dark/mesh */}
```

Use the solid (default) ground on light organiser dashboards; use `glass` on dark buyer surfaces sitting over the mesh. Labels and placeholders are Mexican Spanish.
