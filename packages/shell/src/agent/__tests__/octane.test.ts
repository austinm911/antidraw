// @vitest-environment jsdom
import { beforeEach, expect, test } from "vitest"
import { octaneParent, renderedWithin } from "../octane"
import { renderedWithin as treeRenderedWithin, treeParent } from "../tree"

// Octane stamps each top-level node of a portal with the element it was
// rendered from (`$$portalParent`). The stamp is written by hand here, as
// Octane's portal renderer writes it.

let container: HTMLElement
let trigger: HTMLElement
let item: HTMLElement
let popup: HTMLElement
let stranger: HTMLElement

beforeEach(() => {
  document.body.innerHTML = `
    <div id="frame"><div class="card"><div id="action"><button id="trigger">…</button></div></div></div>
    <div id="portal"><div id="popup" role="menu"><div id="item" role="menuitem">Rename</div></div></div>
    <div id="other"><span id="stranger">elsewhere</span></div>`
  container = document.getElementById("frame")!
  trigger = document.getElementById("trigger")!
  item = document.getElementById("item")!
  popup = document.getElementById("popup")!
  stranger = document.getElementById("stranger")!
  Reflect.set(document.getElementById("portal")!, "$$portalParent", document.getElementById("action"))
})

test("a portal's content is the component's, wherever it sits in the DOM", () => {
  expect(renderedWithin(item, container)).toBe(true)
  expect(renderedWithin(popup, container)).toBe(true)
  expect(treeRenderedWithin(item, container)).toBe(true)
})

test("nothing outside a portal rendered from the component counts", () => {
  expect(renderedWithin(stranger, container)).toBe(false)
  // In its DOM is the DOM's business, not the portal reader's.
  expect(renderedWithin(trigger, container)).toBe(false)
})

test("the top of a portal's parent is the element it was rendered from", () => {
  const top = document.getElementById("portal")!
  expect(octaneParent(top, container)).toBe(document.getElementById("action"))
  expect(octaneParent(item, container)).toBe(popup)
  expect(treeParent(top, container)).toBe(document.getElementById("action"))
})

test("a portal rendered from elsewhere has no parent in the component", () => {
  Reflect.set(document.getElementById("portal")!, "$$portalParent", document.getElementById("other"))
  expect(renderedWithin(item, container)).toBe(false)
  expect(octaneParent(document.getElementById("portal")!, container)).toBe(null)
})
