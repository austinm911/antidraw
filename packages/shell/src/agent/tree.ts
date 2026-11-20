import { octaneParent, renderedWithin as octaneRenderedWithin } from "./octane"
import { reactParent, renderedWithin as reactRenderedWithin } from "./react"

// What the framework that rendered a frame knows about its DOM: which content
// it put in a portal (a dialog, a menu) and the element that content was
// rendered from. Each reader answers empty without its framework's data, so a
// frame is read by whichever framework rendered it.

export const renderedWithin = (el: Element, container: Element) =>
  reactRenderedWithin(el, container) || octaneRenderedWithin(el, container)

export const treeParent = (el: Element, container: Element) =>
  reactParent(el, container) ?? octaneParent(el, container)
