/**
 * The widget mounts into a *closed* shadow root, so its content is unreachable
 * from the document. `attachShadow` still returns the root, so capture it there
 * rather than weakening the widget to `open` just for the tests. Installed for
 * every test by `test/setup.ts`.
 */
const originalAttachShadow = Element.prototype.attachShadow;
const roots: ShadowRoot[] = [];

export function installShadowRootCapture(): void {
  roots.length = 0;
  Element.prototype.attachShadow = function attachShadow(init: ShadowRootInit) {
    const root = originalAttachShadow.call(this, init);
    roots.push(root);
    return root;
  };
}

export function restoreShadowRootCapture(): void {
  Element.prototype.attachShadow = originalAttachShadow;
  roots.length = 0;
}

/** Shadow roots of every widget still attached to the document. */
export function mountedShadowRoots(): ShadowRoot[] {
  return roots.filter((root) => document.contains(root.host));
}

/** The shadow root of the single mounted widget, typed for Testing Library's `within()`. */
export function widgetRoot(): HTMLElement {
  const mounted = mountedShadowRoots();
  if (mounted.length !== 1) {
    throw new Error(`Expected exactly one mounted widget, found ${mounted.length}.`);
  }
  // Testing Library queries only need querySelectorAll, which ShadowRoot has.
  return mounted[0] as unknown as HTMLElement;
}

/** Visible text of every mounted widget. */
export function widgetText(): string {
  return mountedShadowRoots()
    .map((root) => root.textContent ?? '')
    .join(' ');
}
