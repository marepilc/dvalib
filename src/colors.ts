'use strict'


import {dva} from './main'
import {hexStr, int} from './helpers'
import {constrain, round} from './math'
import {randomInt} from './numbers'


interface ColorRGB {
    r: number,
    g: number,
    b: number
}

/**
 * This function converts color to the `rgba` string
 * @param c Color. It can be provided as an array with RGB values between 0 and 255,
 * hex string or single number for the gray color.
 * @param alpha Transparency - value between 0 and 1
 */
export function color2rgba(c: number[] | string | number, alpha: number=1): string {
    let r: number
    let g: number
    let b: number
    let a: number
    switch (typeof c) {
        case 'object':
            if (Array.isArray(c) && c.length === 3) {
                r = constrain(c[0], 0, 255)
                g = constrain(c[1], 0, 255)
                b = constrain(c[2], 0, 255)
                a = constrain(alpha, 0, 1)
            } else {
                r = g = b = 0
                a = 1
            }
            break
        case 'number':
            r = g = b = constrain(c as number, 0, 255)
            a = constrain(alpha, 0, 1)
            break
        case 'string':
            let rgb = str2rgb(c as string)
            r = rgb.r
            g = rgb.g
            b = rgb.b
            a = constrain(alpha, 0, 1)
            break
    }
    return `rgba(${r}, ${g}, ${b}, ${a})`
}

function str2rgb(col: string): ColorRGB {
    let rgb: ColorRGB = {
        r: 0,
        g: 0,
        b: 0
    };
    let rgx: RegExp = /^#+([a-fA-F\d]{6}|[a-fA-F\d]{3})$/
    if (rgx.test(col)) {
        if (col.length == 4) {
            col = col.slice(0, 2) + col[1] + col.slice(2)
            col = col.slice(0, 4) + col[3] + col.slice(4)
            col = col + col[5]
        }
        rgb.r = int(col.slice(1, 3), 16)
        rgb.g = int(col.slice(3, 5), 16)
        rgb.b = int(col.slice(5), 16)
    }
    return rgb
}

/**
 * This function can be used to mix together two colors with given proportion.
 * @param color1
 * @param color2
 * @param proportion Blending proportion (between `0` and `1`.)
 */
export function blend(color1: string, color2: string, proportion: number): string {
    proportion = constrain(proportion, 0, 1)
    let c1 = (color1.indexOf('#') === 0) ? color1 : '#' + color1
    let c2 = (color2.indexOf('#') === 0) ? color2 : '#' + color2
    let rgx: RegExp = /^#+([a-fA-F\d]{6}|[a-fA-F\d]{3})$/
    if (rgx.test(c1) && rgx.test(c2)) {
        let col1 = (c1.length === 7) ? c1.slice(1) : c1
        let col2 = (c2.length === 7) ? c2.slice(1) : c2
        let r1 = int(col1.slice(0, 2), 16)
        let r2 = int(col2.slice(0, 2), 16)
        let r = round((1 - proportion) * r1 + proportion * r2)
        let g1 = int(col1.slice(2, 4), 16)
        let g2 = int(col2.slice(2, 4), 16)
        let g = round((1 - proportion) * g1 + proportion * g2)
        let b1 = int(col1.slice(4), 16)
        let b2 = int(col2.slice(4), 16)
        let b = round((1 - proportion) * b1 + proportion * b2)
        let strR = r.toString(16)
        if (strR.length === 1) strR = '0' + strR
        let strG = g.toString(16)
        if (strG.length === 1) strG = '0' + strG
        let strB = b.toString(16)
        if (strB.length === 1) strB = '0' + strB
        return '#' + strR + strG + strB
    } else {
        return '#000000'
    }
}

/**
 * This function generates the random color.
 */
export function randomColor(): string {
    let r: string = hexStr(randomInt(0, 255))
    let g: string = hexStr(randomInt(0, 255))
    let b: string = hexStr(randomInt(0, 255))
    return '#' + r + g + b
}


export interface CanvasGradient {
    addColorStop(offset: number, color: string): void
}

/**
 * You can use this function to create the linear gradient between two points.
 * To add colors to the gradient, use the addColorStop function (see example below.)
 *
 * ```typescript
 * const gradient = linearGradient(0, 0, 300, 0)
 * gradient.addColorStop(0, '#6a9122')
 * gradient.addColorStop(xScale(animation.currentFrame % 300), '#912222')
 * gradient.addColorStop(1, '#227791')
 * fill(gradient)
 * ```
 * @param x0 X coordinate of the start point
 * @param y0 Y coordinate of the start point
 * @param x1 X coordinate of the end point
 * @param y1 Y coordinate of the end point
 */
export function linearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    if (!!dva.ctx) {
        return  dva.ctx.createLinearGradient(x0, y0, x1, y1)
    } else {
        return new CanvasGradient
    }
}
