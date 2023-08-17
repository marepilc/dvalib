'use strict'


import {constrain, PI, round} from "./math";
import {dva} from "./main";

export function number2str(x: number, radix: number = 10): string {
    return x.toString(radix)
}

/**
 * This function converts number to string with the thousands' separator.
 * @param v Number
 * @param sep String used as a separator.
 */
export function thousandSep(v: number, sep: string): string {
    let s: string = number2str(v)
    let st: string[] = s.split('.')
    let st1 = st[0]
    let st2 = st.length > 1 ? '.' + st[1] : ''
    let rgx: RegExp = /(\d+)(\d{3})/
    while (rgx.test(st1)) {
        st1 = st1.replace(rgx, '$1' + sep + '$2')
    }
    return st1 + st2
}

/**
 * This function converts degrees to radians.
 * @param a Angle in degrees
 */
export function deg2rad(a: number): number {
    return a * PI / 180
}

/**
 * This function converts string to integer - alias for `parseInt` function.
 * @param s Numeric string.
 * @param radix Base in mathematical numeral systems (between 2 and 36.)
 */
export function int(s: string, radix: number = 10): number {
    return parseInt(s, radix)
}

/**
 * Alias of the `String` constructor.
 */
export let str: StringConstructor = String

/**
 * This function converts millimeters to pixels.
 * @param v Value in mm.
 */
export function mm2px(v: number): number {
    return round(dva.dpi * v / 25.4)
}

/**
 * his function converts pixels to mm.
 * @param v Value in pixels.
 */
export function px2mm(v: number): number {
    return round(v * 25.4 / dva.dpi * 10) / 10
}

/**
 * This function converts number between 0 and 255 to HEX string.
 * @param v Number between `0` and `255`.
 */
export function hexStr(v: number): string {
    if (constrain(v, 0, 255).toString(16).length == 1) {
        return 0 + constrain(v, 0, 255).toString(16)
    } else {
        return constrain(v, 0, 255).toString(16)
    }
}
