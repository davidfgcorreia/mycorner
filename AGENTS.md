<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Mount the interactive portfolio at the client-only index route because WebGL and generated canvas textures require browser APIs.
- Keep cabin rendering separate from the DOM portfolio panels and shared sample data so 3D objects and accessible navigation open the same content.
- Drive camera framing, object motion and readable-content mounting from one selection state and the scene Director's settle signal so motion and content never drift apart.
- Preserve the scene container's page bounds in reading mode so only the camera changes framing, avoiding layout jumps on entering and leaving objects.
- Define object placements, local readable faces, camera frames and HTML pixel sizes in reading-surfaces; animated objects take their poses from pure functions there so the open pose and the camera target cannot diverge.
- Mount transformed reading HTML into a stable dedicated portal and remount on reading-state changes to avoid Drei roots losing their DOM attachment during updates.
- The room view shows only lightweight textures and marks; mount transformed HTML solely for the selected object once it is settled, as a child of that object outside asset Suspense boundaries.
- Keep DOM controls in SceneOverlay outside the scene JSX runtime, because that runtime strips ARIA props from component boundaries.
- Reference downloaded CC0 GLB props through asset pointer imports and normalize cloned scenes before placement to keep model scales consistent.
- Use the scene-local JSX runtime for R3F files to strip DOM-only preview metadata at both Three intrinsic and component boundaries (Drei forwards unknown props to groups), preserving native DOM tracking and dashed Three properties.
