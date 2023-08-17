'use strict'

/**
 * his function, if called with arguments, is an alias of `console.log`.
 * Without arguments, is an alias of `window.print`.
 * @param items
 */
export function print(...items: any) {
  if (items.length != 0) {
    console.log(...items)
  } else {
    window.print()
  }
}

/**
 * This function converts SVG text into HTMLImageElement.
 * #### Usage example
 *
 * ```typescript
 * dvaStart(setup, draw)
 *
 * let svg: string
 * let img: HTMLImageElement
 *
 * function setup() {
 *     createCanvas(document.getElementById('canvas-container')!)
 *     resizeCanvas(300, 200)
 *     staticDrawing()
 *     svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
 *         <circle cx="50" cy="50" r="50" />
 *         </svg>`
 *     img = svg2img(svg)
 * }
 *
 * function draw() {
 *     clear()
 *     console.log(img)
 *     placeImage(img, width / 2, height / 2, 'center-middle', 50, 50)
 * }
 * ```
 * @param svg
 */
export function svg2img(svg: string): HTMLImageElement {
  const img = new Image()
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  img.src = URL.createObjectURL(blob)
  return img
}
