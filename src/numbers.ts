'use strict'

import { round } from './math'

/**
 * The `Noise` class is used to generate a random numbers which are within
 * specified range to the previously generated number.
 *
 * #### Usage example
 *
 * ```typescript
 * import {
 *     animation,
 *     clear,
 *     createCanvas,
 *     dvaStart,
 *     noFill,
 *     Noise,
 *     polyline,
 *     resizeCanvas,
 *     strokeWidth
 * } from 'main'
 *
 * dvaStart(setup, draw)
 *
 * let n: Noise
 *
 * function setup() {
 *     createCanvas(document.getElementById('canvas-container')!)
 *     resizeCanvas(300, 200)
 *     noFill()
 *     strokeWidth(3)
 *     n = new Noise(20, 180, 0.1)
 * }
 *
 * function draw() {
 *     if (animation.currentFrame % 60 === 0) {
 *         clear()
 *         drawLine()
 *     }
 * }
 *
 * function drawLine() {
 *     let points = []
 *     for (let i = 20; i <= 280; i += 10) {
 *         points.push(i)
 *         points.push(n.intValue)
 *     }
 *     polyline(points)
 * }
 * ```
 */
export class Noise {
  private _min: number
  private _max: number
  private _range: number
  private _value: number

  /**
   * @param min Lower limit.
   * @param max Upper limit.
   * @param noiseRange Number between 0 and 1 - i.e. 0.1 means 10% of the overall range.
   */
  constructor(min: number, max: number, noiseRange: number) {
    this._min = min
    this._max = max
    this._range = noiseRange * (max - min)
    this._value = Math.random() * (max - min) + min
  }

  /**
   * Setter for the new lower limit.
   * @param value New lower limit.
   */
  set min(value: number) {
    if (this._value < value) {
      this._value = value
    }
    this._min = value
  }

  /**
   * Setter for the new upper limit.
   * @param value New upper limit.
   */
  set max(value: number) {
    if (this._value > value) {
      this._value = value
    }
    this._max = value
  }

  /**
   * Setter for the new range.
   * @param value New range - number from 0 to 1 - percentage of the overall range.
   */
  set noiseRange(value: number) {
    if (value > 0 && value < 1) {
      this._range = value * (this._max - this._min)
    }
  }

  /**
   * Floating point random value.
   */
  get value(): number {
    this.nextValue()
    return this._value
  }

  /**
   * Setter for the new value.
   * @param value New value.
   */
  set value(value: number) {
    if (value >= this._min && value <= this._max) {
      this._value = value
    }
  }

  /**
   * Integer random value.
   */
  get intValue(): number {
    this.nextValue()
    return round(this._value)
  }

  private nextValue(): void {
    let min0, max0
    min0 = this._value - this._range / 2
    max0 = this._value + this._range / 2
    if (min0 < this._min) {
      min0 = this._min
      max0 = min0 + this._range
    } else if (max0 > this._max) {
      max0 = this._max
      min0 = max0 - this._range
    }
    this._value = Math.random() * (max0 - min0) + min0
  }
}

export function randomInt(a: number, b: number): number {
  return Math.floor(Math.random() * (Math.max(a, b) - Math.min(a, b) + 1)) + Math.min(a, b)
}

export function choose<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)]
}

export function random(...args: number[]): number {
  if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
    const e1 = Math.max(args[0], args[1]) - Math.min(args[0], args[1])
    const e2 = Math.min(args[0], args[1])
    return Math.random() * e1 + e2
  } else {
    return Math.random()
  }
}

/**
 * This function shuffles the array.
 * @param items An array of items to shuffle.
 */
export function shuffle<T>(items: T[]): void {
  let j, x
  for (let i = items.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = items[i]
    items[i] = items[j]
    items[j] = x
  }
}

/**
 * This is a compareFunction for the JavaScript `sort` function - ascending order.
 * #### Usage example
 *
 * ```typescript
 * let arr = [3, 6, 1, 0, 12]
 * arr.sort(asc)
 * ```
 * @param a
 * @param b
 */
export function asc(a: number, b: number): number {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN
}

/**
 * This is a compareFunction for the JavaScript `sort` function - descending order.
 * #### Usage example
 *
 * ```typescript
 * let arr = [3, 6, 1, 0, 12]
 * arr.sort(des)
 * ```
 * @param a
 * @param b
 */
export function desc(a: number, b: number): number {
  return a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
}

/**
 * This function returns sorted array of unique elements.
 * @param items An array of items.
 */
export function unique<T>(items: T[]): T[] {
  return items
    .filter((value, index, self) => {
      return self.indexOf(value) === index
    })
    .sort()
}

/**
 * This function returns an array of Fibonacci numbers.
 * @param n Length of the array.
 * @returns Fibonacci numbers.
 */
export function fibonacci(n: number): number[] {
  const result = [1, 1]
  if (n < 1) {
    return []
  } else if (n === 1) {
    return [1]
  } else if (n === 2) {
    return [1, 1]
  } else {
    for (let i = 0; i < n - 2; i++) {
      result.push(result[i] + result[i + 1])
    }
    return result
  }
}
