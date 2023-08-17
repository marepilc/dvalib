'use strict'


import {number2str} from "./helpers";

/**
 * This function returns a rounded value.
 * @param v Number to be rounded.
 * @param decimal Number of the decimal places.
 * @returns Rounded value
 */
export function round(v: number, decimal?: number): number { // round
    if (decimal) {
        let n = 1
        for (let i = 0; i < decimal; i++) {
            n *= 10
        }
        return Math.round(v * n) / n
    } else {
        return Math.round(v)
    }
}

/**
 * This function returns a rounded value as a string.
 * @param v Number to be rounded.
 * @param decimal Number of the decimal places.
 * @returns Rounded value
 */
export function round2str(v: number, decimal: number): string {
    let s = number2str(round(v, decimal))
    let ss: string[] = s.split('.')
    let missing0: number
    if (ss.length === 2) {
        missing0 = decimal - ss[1].length
    } else {
        s += '.'
        missing0 = decimal
    }
    for (let i = 0; i < missing0; i++) {
        s += '0'
    }
    return s
}

/**
 * Alias of the `Math.floor`
 */
export let floor: (v: number) => number = Math.floor

/**
 * Alias of the `Math.ceil`
 */
export let ceil: (v: number) => number = Math.ceil

/**
 * This function returns a number constrained to the limits specified by `l1` and `l2`.
 * @param v Value to be constrained.
 * @param l1 Lower limit.
 * @param l2 Upper limit.
 * @returns Constrained value.
 */
export function constrain(v: number, l1: number, l2: number): number {
    if (v < Math.min(l1, l2)) {
        return Math.min(l1, l2)
    } else if (v > Math.max(l1, l2)) {
        return Math.max(l1, l2)
    } else {
        return v
    }
}

/**
 * This function returns a square of the value.
 * @param v Value to be squared.
 * @returns Square of the value.
 */
export function sq(v: number): number {
    return Math.pow(v, 2)
}

/**
 * Alias of the `Math.pow`
 */
export let pow: (x: number, y: number) => number = Math.pow

/**
 * Alias of the `Math.sqrt`
 */
export let sqrt: (x: number) => number = Math.sqrt

/**
 * Alias of the `Math.abs`
 */
export let abs: (x: number) => number = Math.abs

/**
 * This function returns maximum value from the array of numbers.
 * @param numbers Array of numbers.
 * @returns Maximum value
 */
export function max(numbers: number[]): number {
    return Math.max(...numbers)
}

/**
 * This function returns minimum value from the array of numbers.
 * @param numbers Array of numbers.
 * @returns Minimum value
 */
export function min(numbers: number[]): number {
    return Math.min(...numbers)
}

/**
 * This function returns a sum of the all elements in the array of numbers.
 * @param numbers Array of numbers.
 * @returns Sum of the all numbers in the array.
 */
export function sum(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b)
}

/**
 * This function returns  an average value from all elements in the array of numbers.
 * @param numbers Array of numbers.
 * @returns Average value.
 */
export function avg(numbers: number[]): number {
    return sum(numbers) / numbers.length
}

/**
 * This function returns percentile from array of numbers.
 * i.e. `centile([1, 3, 4, 5, 7, 7, 8, 9, 10], 90)` returns a value on 90th percentile.
 * @param numbers
 * @param c Percentile - number from 0 to 100
 */
export function centile(numbers: number[], c: number): number {
    let dataCopy = numbers.concat()
    dataCopy.sort(function (a, b) {
        return a - b
    })
    let pos = (dataCopy.length + 1) * c / 100
    let ix = floor(pos)
    if (ix === 0) {
        return dataCopy[ix]
    } else if (ix > dataCopy.length - 1) {
        return dataCopy[dataCopy.length - 1]
    } else {
        let rem = pos - ix
        let diff = dataCopy[ix] - dataCopy[ix - 1]
        return dataCopy[ix - 1] + diff * rem
    }
}

/**
 * This function returns percentile on witch specific number (n) is in the array of numbers.
 * @param numbers
 * @param n
 * @returns Percentile of the given number.
 */
export function revCentile(numbers: number[], n: number): number {
    let dataCopy = numbers.concat()
    dataCopy.sort(function (a, b) {
        return a - b
    })
    let pos1: number = 1
    let pos2: number = dataCopy.length
    for (let i = 0; i < dataCopy.length; i++) {
        if (dataCopy[i] < n) {
            pos1++
        } else if (dataCopy[i] > n) {
            pos2 = i
            break;
        }
    }
    return floor(avg([pos1, pos2])) / dataCopy.length * 100
}

/**
 * This function returns a difference between 75th and 25th centile.
 * @param numbers
 */
export function iqr(numbers: number[]): number {
    return centile(numbers, 75) - centile(numbers, 25)
}

/**
 * This function returns the difference between maximum and minimum value from the array.
 * @param numbers
 */
export function dataRange(numbers: number[]): number {
    return max(numbers) - min(numbers)
}

export type SDevMethod = 'sample' | 'population'

/**
 * This function returns a standard deviation based on specified method.
 * @param numbers Array of values.
 * @param method Method based on which the standard deviation is calculated.
 */
export function stdDev(numbers: number[], method: SDevMethod = 'sample'): number {
    let avgX = avg(numbers)
    let s = 0
    for (let i = 0; i < numbers.length; i++) {
        s += pow(numbers[i] - avgX, 2)
    }
    let divider = numbers.length - 1
    if (method === 'population') {
        divider = numbers.length
    }
    return sqrt(s / divider)
}

/**
 * This class can be used for all the 2D vector operations on canvas.
 */
export class Vector {
    private _x: number
    private _y: number

    /**
     * Creates a new 2D vector.
     * @param x
     * @param y
     */
    constructor(x: number, y: number) {
        this._x = x
        this._y = y
    }

    /**
     * Changes the x and y coordinates.
     * @param x New `X` coordinate.
     * @param y New `Y` coordinate.
     */
    public set(x: number, y: number) {
        this._x = x
        this._y = y
    }

    public get x(): number {
        return this._x
    }

    public set x(v: number) {
        this._x = v
    }

    public get y(): number {
        return this._y
    }

    public set y(v: number) {
        this._y = v
    }

    public get xy(): [number, number] {
        return [this._x, this._y]
    }

    /**
     * Returns duplicate of the vector.
     */
    public copy(): Vector {
        return new Vector(this._x, this._y)
    }

    /**
     * Add another vector and returns result (calling vector remains unchanged.)
     * @param v
     */
    public add(v: Vector): Vector {
        return new Vector(this._x + v.x, this._y + v.y)
    }

    /**
     * Modifies vector by adding another one.
     * @param v
     */
    public add2(v: Vector): void {
        this._x += v.x
        this._y += v.y
    }

    /**
     * Subtracts another vector and returns result (calling vector remains unchanged.)
     * @param v
     */
    public sub(v: Vector): Vector {
        return new Vector(this._x - v.x, this._y - v.y)
    }

    /**
     * Modifies vector by subtracting another one.
     * @param v
     */
    public sub2(v: Vector): void {
        this._x -= v.x
        this._y -= v.y
    }

    /**
     * Multiplies vector by scalar and returns result (calling vector remains unchanged.)
     * @param s
     */
    public mult(s: number): Vector {
        return new Vector(this._x * s, this._y * s)
    }

    /**
     * Modifies vector by multiplying by scalar.
     * @param s
     */
    public mult2(s: number): void {
        this._x *= s
        this._y *= s
    }

    /**
     * Divides vector by scalar and returns result (calling vector remains unchanged.)
     * @param s
     */
    public div(s: number): Vector {
        return new Vector(this._x / s, this._y / s)
    }

    /**
     * Modifies vector by dividing by scalar.
     * @param s
     */
    public div2(s: number): void {
        this._x /= s
        this._y /= s
    }

    /**
     * Returns the dot product of two vectors.
     * @param v
     */
    public dot(v: Vector): number { // dot product of two vectors
        return this._x * v.x + this._y * v.y
    }

    /**
     * Normalizes the vector and return as a new one (calling vector remains unchanged.)
     */
    public norm(): Vector {
        let e1 = this._x / (Math.sqrt(this._x * this._x + this.y * this.y))
        let e2 = this._y / (Math.sqrt(this._x * this._x + this._y * this._y))
        return new Vector(e1, e2)
    }

    /**
     * Normalizes the vector.
     */
    public norm2(): void {
        let e1 = this._x / (Math.sqrt(this._x * this._x + this._y * this._y))
        let e2 = this._y / (Math.sqrt(this._x * this._x + this._y * this._y))
        this._x = e1
        this._y = e2
    }

    get direction(): number {
        return Math.atan2(this._y, this._x)
    }

    set direction(angle: number) {
        let magnitude = this.magnitude;
        this._x = Math.cos(angle) * magnitude
        this._y = Math.sin(angle) * magnitude
    }

    get magnitude(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y)
    }

    set magnitude(magnitude: number) {
        let direction = this.direction
        this._x = Math.cos(direction) * magnitude
        this._y = Math.sin(direction) * magnitude
    }

    /**
     * Limits the vector's magnitude.
     * @param limitScalar
     */
    public limit(limitScalar: number) {
        if (this.magnitude > limitScalar) {
            let direction = this.direction
            this._x = Math.cos(direction) * limitScalar
            this._y = Math.sin(direction) * limitScalar
        }
    }
}

/**
 * Alias of the `Math.E`
 */
export const E = Math.E

/**
 * Alias of the `Math.PI`
 */
export const PI = Math.PI

/**
 * Alias of the `Math.PI * 2`
 */
export const TWO_PI = Math.PI * 2

/**
 * Alias of the `Math.PI / 2`
 */
export const HALF_PI = Math.PI / 2

/**
 * Golden ratio: `1.61803398875`
 */
export const PHI = (1 + Math.sqrt(5)) / 2

/**
 * Alias of the `Math.sin`
 */
export const sin = Math.sin

/**
 * Alias of the `Math.cos`
 */
export const cos = Math.cos

/**
 * Alias of the `Math.tan`
 */
export const tan = Math.tan

/**
 * Alias of the `Math.`asin
 */
export const asin = Math.asin

/**
 * Alias of the `Math.acos`
 */
export const acos = Math.acos

/**
 * Alias of the `Math.atan`
 */
export const atan = Math.atan

/**
 * Alias of the `Math.atan2`
 */
export const atan2 = Math.atan2

/**
 * This function returns the distance in pixels between points (x1, y1) and (x2, y2).
 * @param x1 X coordinate of the first point
 * @param y1 Y coordinate of the first point
 * @param x2 X coordinate of the second point
 * @param y2 Y coordinate of the second point
 * @returns Distance in px
 */
export function dist(x1: number, y1: number, x2: number, y2: number): number {
    return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2))
}
