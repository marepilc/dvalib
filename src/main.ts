'use strict'

import { preloader, AssetsObject, assetList } from './assets'
import { round, floor, abs, Vector } from './math'
import { setFont } from './typography'

/**
 * The `Keyboard` class is used for user interaction with the keyboard.
 * There is always one instance created for the specific canvas,
 * and stored in the {@link keyboard} variable, so there is no need
 * to create any additional instance.
 * #### Usage example
 *
 * ```typescript
 * import {
 *     canvas,
 *     clear,
 *     createCanvas,
 *     fill,
 *     fontSize,
 *     height,
 *     keyboard,
 *     dvaStart,
 *     resizeCanvas,
 *     text,
 *     textAlign,
 *     textBaseline,
 *     width
 * } from 'main'
 *
 * dvaStart(setup, draw)
 *
 * function setup() {
 *     createCanvas(document.getElementById('canvas-container')!)
 *     resizeCanvas(300, 200)
 *     fontSize(18)
 *     canvas()!.focus()
 * }
 *
 * function draw() {
 *     clear()
 *     fill(0)
 *     textAlign('left')
 *     textBaseline('middle')
 *     text('press any key', 20, 20)
 *     if (keyboard.keyPressed) {
 *         textAlign('center')
 *         text(`'${keyboard.keyPressed}' is pressed.`, width / 2, height - height / 2)
 *     }
 *     if (keyboard.shiftIsPressed) {
 *         textAlign('left')
 *         text(`'Shift' is pressed`, 20, height - 20)
 *     }
 * }
 * ```
 */
export class Keyboard {
  /**
   * Returns `true` if any key is pressed.
   */
  public keyIsPressed: boolean
  /**
   * Returns `true` if *Alt* is pressed.
   */
  public altIsPressed: boolean
  /**
   * Returns `true` if *Shift* is pressed.
   */
  public shiftIsPressed: boolean
  /**
   * Returns `true` if *Ctrl* is pressed.
   */
  public ctrlIsPressed: boolean
  /**
   * Returns currently pressed key or `null` if no key is pressed.
   */
  public keyPressed: string | null
  /**
   * This function may be defined by user
   */
  public keyDown: ((key: string) => void) | null
  /**
   * This function may be defined by user
   */
  public keyUp: ((key: string) => void) | null
  private _canvas: HTMLCanvasElement

  /**
   *
   * @param canvas HTML5 Canvas element with the visualization.
   */
  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas
    this.keyIsPressed = false
    this.altIsPressed = false
    this.shiftIsPressed = false
    this.ctrlIsPressed = false
    this.keyPressed = null
    this.keyDown = null
    this.keyUp = null
    this._canvas.tabIndex = 1 // to make it focusable
    this._canvas.addEventListener('keydown', (e: KeyboardEvent) => {
      this.keyIsPressed = true
      if (e.key === 'Alt') this.altIsPressed = true
      if (e.key === 'Shift') this.shiftIsPressed = true
      if (e.key === 'Control') this.ctrlIsPressed = true
      this.keyPressed = e.key
      if (this.keyDown != null) {
        this.keyDown(e.key)
      }
    })
    this._canvas.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keyIsPressed = false
      if (e.key === 'Alt') this.altIsPressed = false
      if (e.key === 'Shift') this.shiftIsPressed = false
      if (e.key === 'Control') this.ctrlIsPressed = false
      this.keyPressed = null
      if (this.keyUp != null) {
        this.keyUp(e.key)
      }
    })
  }
}

/**
 * The `Mouse` class is used for user interaction with the mouse.
 * There is always one instance created for the specific canvas,
 * and stored in the {@link mouse} variable, so there is no need
 * to create any additional instance.
 */
export class Mouse {
  private _canvas: HTMLCanvasElement
  private _x: number
  private _y: number
  private _px: number
  private _py: number
  private readonly _pos: Vector
  private readonly _ppos: Vector
  /**
   * Returns `true` if any of the mouse buttons is pressed.
   */
  public isPressed: boolean
  /**
   *  Returns button number.
   */
  public button: number | null
  /**
   * This function may be defined by user
   */
  public wheel: ((e: WheelEvent) => void) | null
  /**
   * This function may be defined by user
   */
  public down: ((e: MouseEvent) => void) | null
  /**
   * This function may be defined by user
   */
  public up: ((e: MouseEvent) => void) | null
  /**
   * This function may be defined by user
   */
  public click: ((e: MouseEvent) => void) | null
  /**
   * This function may be defined by user
   */
  public dblClick: ((e: MouseEvent) => void) | null
  /**
   * This function may be defined by user
   */
  public move: (() => void) | null
  /**
   * This function may be defined by user
   */
  public enter: (() => void) | null
  /**
   * This function may be defined by user
   */
  public leave: (() => void) | null

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas
    this._x = 0
    this._y = 0
    this._px = 0
    this._py = 0
    this._pos = new Vector(0, 0)

    this._ppos = new Vector(0, 0)
    this.isPressed = false
    this.button = null
    this.wheel = null
    this.down = null
    this.up = null
    this.click = null
    this.dblClick = null
    this.move = null
    this.enter = null
    this.leave = null

    this._canvas.addEventListener('mousemove', (e: MouseEvent) => {
      this._updateMousePos(canvas, e)
      if (this.move) this.move()
    })
    this._canvas.addEventListener('wheel', (e: WheelEvent) => {
      this._updateMousePos(canvas, e)
      if (this.wheel != null) {
        this.wheel(e)
      }
    })
    this._canvas.addEventListener(
      'mousedown',
      (e: MouseEvent) => {
        this.isPressed = true
        this.button = e.button
        if (this.down != null) {
          this.down(e)
        }
      },
      false
    )
    this._canvas.addEventListener(
      'mouseup',
      (e: MouseEvent) => {
        this.isPressed = false
        this.button = null
        if (this.up != null) {
          this.up(e)
        }
      },
      false
    )
    this._canvas.addEventListener(
      'click',
      (e: MouseEvent) => {
        if (this.click != null) {
          this.click(e)
        }
      },
      false
    )
    this._canvas.addEventListener(
      'dblclick',
      (e: MouseEvent) => {
        if (this.dblClick != null) {
          this.dblClick(e)
        }
      },
      false
    )
    this._canvas.addEventListener('mouseenter', () => {
      if (typeof this.enter === 'function') this.enter()
    })
    this._canvas.addEventListener('mouseleave', () => {
      if (typeof this.leave === 'function') this.leave()
    })
  }

  private _updateMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
    this._px = this._x
    this._py = this._y
    this._ppos.set(this._px, this._py)
    const bbox = canvas.getBoundingClientRect()
    this._x = abs(round(e.clientX - bbox.left))
    this._y = abs(round(e.clientY - bbox.top))
    this._pos.set(this._x, this._y)
  }

  /**
   * Current mouse `X` position.
   */
  get x() {
    return this._x
  }

  /**
   * Current mouse `Y` position.
   */
  get y() {
    return this._y
  }

  /**
   * Previous mouse `X` position.
   */
  get px() {
    return this._px
  }

  /**
   * Previous mouse `Y` position.
   */
  get py() {
    return this._py
  }

  get pos() {
    return this._pos
  }

  get ppos() {
    return this._ppos
  }
}

/**
 * The `Animation` class is used for user controlling and using animation parameters.
 * There is always one instance created for the specific canvas,
 * and stored in the {@link animation} variable, so there is no need
 * to create any additional instance.
 * #### Usage example
 *
 * ```typescript
 * import {
 *     animation,
 *     clear,
 *     createCanvas,
 *     fontSize,
 *     height,
 *     dvaStart,
 *     mouse,
 *     randomInt,
 *     resizeCanvas,
 *     text
 * } from 'main'
 *
 * dvaStart(setup, draw, events)
 *
 * function setup() {
 *     createCanvas(document.getElementById('canvas-container')!)
 *     resizeCanvas(300, 200)
 *     fontSize(16)
 * }
 *
 * function draw() {
 *     const action = (animation.isAnimating) ? 'stop' : 'start'
 *     clear()
 *     text(`Click inside canvas to ${action} animation.`, 20, 30)
 *     text(`current FPS: ${animation.fps}`, 20, height / 2 + 5)
 *     text(`Current Frame: ${animation.currentFrame}`, 20, height - 20)
 * }
 *
 * function events() {
 *     mouse.click = () => {
 *         if (animation.isAnimating) {
 *             animation.stop()
 *         } else {
 *             animation.fps = randomInt(1, 60)
 *             animation.start()
 *         }
 *     }
 * }
 * ```
 */
export class AnimationCtrl {
  private _fps: number
  private _delay: number
  private _time: number | null
  private readonly _step: (x: number) => void
  private _reqAF: number
  /**
   * Animation counter (contains the current frame number.)
   */
  public currentFrame: number
  /**
   * Returns `true` if the animation is running. Otherwise, returns `false`.
   */
  public isAnimating: boolean

  /**
   *
   * @param callback Function which is called continuously with a given frequency.
   * In case of predefined {@link animation} variable, it is the {@link UserFunc | user defined function} `draw`.
   */
  constructor(callback: () => void) {
    this._fps = 60
    this._delay = 1000 / this._fps
    this.currentFrame = 0
    this._time = null
    this._reqAF = 0

    this._step = (timestamp: number) => {
      if (this._time == null) this._time = timestamp
      const seg = floor((timestamp - this._time) / this._delay)
      if (seg > this.currentFrame) {
        // this.currentFrame = seg;
        this.currentFrame++
        callback()
      }
      if (this.isAnimating) {
        this._reqAF = requestAnimationFrame(this._step)
      }
    }

    this.isAnimating = false
  }

  /**
   * Starts the animation.
   */
  start(): void {
    if (!this.isAnimating) {
      this.isAnimating = true
      this._reqAF = requestAnimationFrame(this._step)
    }
  }

  /**
   * Stops the animation.
   */
  stop(): void {
    if (this.isAnimating) {
      this._reqAF = requestAnimationFrame(this._step)
      cancelAnimationFrame(this._reqAF)
      this.isAnimating = false
    }
  }

  /**
   * Used for setting the new animation rate or reading the current one. The default value is 60 fps.
   */
  public get fps() {
    if (this.isAnimating) {
      return this._fps
    } else {
      return 0
    }
  }

  public set fps(v: number) {
    this._fps = v
    this._delay = 1000 / this._fps
    this.currentFrame = 0
    this._time = null
  }
}

export type LengthUnit = 'px' | 'pt' | 'pc' | 'in' | 'Q' | 'mm' | 'cm'

/**
 * The `DVA` class is used to control everything on the canvas 'behind the scene'.
 * An instance of this class is always automatically created, when {@link createCanvas}
 * or {@link selectCanvas} function is used.
 */
export class DVA {
  /**
   * Current canvas 2D context.
   */
  public ctx: CanvasRenderingContext2D | null
  /**
   * HTML5 canvas element with the visualization.
   */
  public canvas: HTMLCanvasElement
  /**
   * Resolution of the canvas.
   */
  public dpi: number
  /**
   * If set to `true` the visualization is a still image.
   */
  public noLoop: boolean
  /**
   * Defines if the shape has a fill property.
   */
  public withFill: boolean
  /**
   * Defines if the shape has a stroke property.
   */
  public withStroke: boolean
  /**
   * Defines current fill color or gradient.
   */
  public currentFill: string | CanvasGradient
  /**
   * Defines current stroke color.
   */
  public currentStroke: string
  /**
   * Defines current font style.
   */
  public fontStyle: string
  /**
   * Defines current font weight.
   */
  public fontWeight: string
  /**
   * Defines current font size.
   */
  public fontSize: number
  /**
   * Defines which unit is used for the font sizing.
   */
  public fontUnit: LengthUnit
  /**
   * Defines current font family.
   */
  public fontFamily: string
  /**
   * Defines current text line height.
   */
  public lineHeight: number
  /**
   * Defines scale coefficient used for resolution adjustment.
   */
  public scaleCoefficient: number

  constructor(canvas: HTMLCanvasElement, noLoop = false) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.dpi = 300
    this.noLoop = noLoop
    this.withFill = true
    this.withStroke = true
    this.currentFill = '#65a30d'
    this.currentStroke = '#44403c'
    this.fontStyle = 'normal'
    this.fontWeight = 'normal'
    this.fontSize = 24
    this.fontUnit = 'px'
    this.fontFamily = 'sans-serif'
    this.lineHeight = 1.1
    this.scaleCoefficient = 1
  }

  /**
   * Commits shape on the canvas.
   */
  public commitShape() {
    if (this.withFill && !!this.ctx) this.ctx.fill()
    if (this.withStroke && !!this.ctx) this.ctx.stroke()
  }
}

// Global variables

/**
 * A global variable that contains the width of the canvas in pixels.
 */
export let width: number

/**
 * A global variable that contains the height of the canvas in pixels.
 */
export let height: number

/**
 * A global variable that contains the instance of the {@link Keyboard} class.
 */
export let keyboard: Keyboard

/**
 * A global variable that contains the instance of the {@link Mouse} class.
 */
export let mouse: Mouse

/**
 * A global variable that contains the instance of the {@link AnimationCtrl} class.
 */
export let animation: AnimationCtrl

/**
 * An object that contains all the assets loaded with the {@link loadAssets} function.
 */
export let assets: AssetsObject

/**
 * A global variable that contains the instance of the {@link DVA} class.
 */
export let dva: DVA

export type CursorType =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  | 'all-scroll'
  | 'col-resize'
  | 'n-resize'
  | 'e-resize'
  | 's-resize'
  | 'w-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'zoom-in'
  | 'zoom-out'

/**
 * This function changes the cursor type.
 * @param display
 */
export function cursor(display: CursorType): void {
  if (dva.canvas) dva.canvas.style.cursor = display
}

/**
 * By default, the canvas resolution is adjusted to the display resolution. However,
 * you have the possibility to modify this internal scaling, using the scaleModifier function.
 *
 * This can be particularly useful when you develop a custom visual for Power BI.
 * @param v
 */
export function scaleModifier(v: number) {
  if (dva) {
    dva.scaleCoefficient = v
  }
}

function setContextDefault(): void {
  if (dva.canvas) {
    dva.ctx = dva.canvas.getContext('2d')
    let pxRatio = window.devicePixelRatio || 1
    pxRatio *= dva.scaleCoefficient
    dva.canvas.width = dva.canvas.clientWidth * pxRatio || 300
    dva.canvas.height = dva.canvas.clientHeight * pxRatio || 150
    width = dva.canvas.clientWidth || 300
    height = dva.canvas.clientHeight || 150
    if (dva.ctx) {
      dva.ctx.scale(pxRatio, pxRatio)
      dva.ctx.fillStyle = dva.currentFill
      dva.ctx.strokeStyle = dva.currentStroke
      setFont()
    }
  }
}

export type UserFunc = (() => void) | null

/**
 * This function has to be called to initiate our project.
 * dvaStart takes four functions as arguments. Not all are required.
 * The first function (setup) should contain the code only for initialization.
 * It is executed only once, thus should be used for setup actions only.
 * Second function (draw) is called by default 60 times a second, and is used
 * for redrawing canvas with mentioned frequency. This function has to be always passed as a second argument,
 * so if there is no need for setup function, `null` shall be passed instead.
 * @param setup Function defined by user for initialization.
 * @param draw Function defined by user for canvas redrawing.
 * @param events Function defined by user for events handling.
 * Inside this function you can redefine the following functions:
 * ```typescript
 * mouse.wheel(e: WheelEvent) => void
 * mouse.down() => void
 * mouse.up() => void
 * mouse.click() => void
 * mouse.dbClick() => void
 * mouse.move() => void
 * mouse.enter() => void
 * mouse.leave() => void
 * keyboard.keyDown(key: string) => void
 * keyboard.keyUp(key: string) => void
 * window.onresize() => void
 * ```
 * @param loadAssets Function defined by user for assets preloading.
 */
export function dvaStart(
  setup?: UserFunc,
  draw?: UserFunc,
  events?: UserFunc,
  loadAssets?: UserFunc
) {
  assets = {}
  if (typeof loadAssets == 'function') loadAssets()
  if (assetList.length > 0) {
    preloader.on('complete', onCompletePreloader) // on complete listener
    preloader.load(assetList) // launch the loading process
  } else {
    lVrun(setup, draw, events)
  }

  function onCompletePreloader(): void {
    for (const a of assetList) {
      assets[a.id] = preloader.getResult(a.id)
    }
    lVrun(setup, draw, events)
  }
}

function lVrun(setup?: UserFunc, draw?: UserFunc, events?: UserFunc) {
  if (animation == undefined) {
    animation = new AnimationCtrl(() => {
      if (draw != undefined) draw()
      if (dva.noLoop) animation.stop()
    })
  }
  if (typeof setup == 'function') setup()
  if (mouse == undefined) mouse = new Mouse(dva.canvas)
  if (typeof events == 'function') {
    events()
  }
  animation.start()
}

/**
 * This function appends HTML Canvas to the selected DOM element.
 * @param target The canvas parent element.
 * @param id Canvas id attribute.
 */
export function createCanvas(target: HTMLElement, id?: string): void {
  const cnv = document.createElement('canvas')
  if (id !== undefined) cnv.id = id
  if (keyboard == undefined) keyboard = new Keyboard(cnv)
  if (dva == undefined) dva = new DVA(cnv)
  target.appendChild(dva.canvas)
  setContextDefault()
}

/**
 * If you do not want to create new canvas, but use the one already present in the DOM,
 * you can use selectCanvas function. The prerequisite is the canvas element, has to have the id attribute.
 * @param id Canvas id attribute.
 */
export function selectCanvas(id: string): void {
  const cnv = <HTMLCanvasElement>document.getElementById(id)
  if (keyboard == undefined && !!cnv) keyboard = new Keyboard(cnv)
  if (dva == undefined && !!cnv) dva = new DVA(cnv)
  setContextDefault()
}

/**
 * This function changes the canvas dimensions.
 * @param w Canvas Width
 * @param h Canvas Height
 * @param canvas Canvas element
 */
export function resizeCanvas(w: number, h: number, canvas: HTMLCanvasElement = dva.canvas): void {
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  setContextDefault()
}

/* transformation */
/**
 * This is the implementation of the `CanvasRenderingContext2D.translate()` function.
 * It moves the canvas' coordinates by a given distance on the horizontal and vertical axis.
 * @param x Distance on horizontal axis.
 * @param y Distance on vertical axis.
 */
export function translate(x: number, y: number): void {
  if (dva.ctx) dva.ctx.translate(x, y)
}

/**
 * This is the implementation of the `CanvasRenderingContext2D.rotate()` function.
 * It rotates the canvas coordinates counterclockwise by given rotation angle in radians.
 * @param angle Rotation angle in radians.
 */
export function rotate(angle: number): void {
  if (dva.ctx) dva.ctx.rotate(angle)
}

/**
 * This is the implementation of the `CanvasRenderingContext2D.scale()` function.
 * It transforms the canvas scale by a given factor.
 * @param x Horizontal scale factor.
 * @param y Vertical scale factor.
 */
export function scale(x: number, y: number): void {
  if (dva.ctx) dva.ctx.scale(x, y)
}

/**
 * This is the implementation of the `CanvasRenderingContext2D.save()` function.
 * It saves the current canvas' state, which can be restored by calling the {@link restore} function.
 * This function saves: stroke, fill, strokeWidth, strokeCup, strokeJoin, dashLine, shadow, font properties,
 * textAlign and textBaseline.
 */
export function save(): void {
  if (dva.ctx) dva.ctx.save()
}

/**
 * This is the implementation of the `CanvasRenderingContext2D.restore()` function.
 * It restores the most recently saved canvas state with the {@link save} function. If there is no saved state, this method does nothing.
 */
export function restore(): void {
  if (dva.ctx) dva.ctx.restore()
}

/**
 * If this function is called inside the setup function, the draw function will be executed only once.
 * You can use this function if you want to generate a still image instead of an animation.
 * This function can be called **only** after canvas is selected or created.
 */
export function staticDrawing(): void {
  dva.noLoop = true
}

/**
 * This function returns the current canvas element.
 */
export function canvas(): HTMLCanvasElement | undefined {
  if (dva.canvas) {
    return dva.canvas
  }
}
