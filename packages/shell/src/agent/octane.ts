// What Octane knows about a DOM node that the DOM doesn't: the element a
// portal's content (a dialog, a menu) was rendered from. Octane records it on
// each top-level node of a portal as `$$portalParent`, in development and
// production builds, and routes events through it. It is an Octane internal,
// read defensively: where it's missing, the answers are empty.

const portalHostOf = (node: Element): Element | null => {
  const host: unknown = Reflect.get(node, "$$portalParent")
  return host instanceof Element ? host : null
}

// The element above `el` in Octane's tree: the element its portal was rendered
// from at the top of a portal, else its DOM parent.
const up = (el: Element): Element | null => portalHostOf(el) ?? el.parentElement

// Whether Octane rendered `el` from inside `container` through a portal: its
// content sits under <body> in the DOM, and under the component in Octane's tree.
export const renderedWithin = (el: Element, container: Element): boolean => {
  let crossedPortal = false
  for (let node = el; ; ) {
    if (portalHostOf(node)) crossedPortal = true
    const next = up(node)
    if (!next) return false
    if (next === container) return crossedPortal
    node = next
  }
}

// The element above `el` in Octane's tree, null above `container` or when
// `el` was not rendered from inside it.
export const octaneParent = (el: Element, container: Element): Element | null => {
  const parent = up(el)
  if (!parent) return null
  return parent === container || container.contains(parent) || renderedWithin(parent, container) ? parent : null
}
