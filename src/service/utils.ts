import { Injectable } from "@angular/core";

@Injectable()
export class Utils {
    constructor() { }

    /**
     * Bytes to string
     *
     * @param {ArrayBuffer} buffer
     * @returns
     * @memberof Utils
     */
    bytesToString(buffer: ArrayBuffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    /**
     * String to bytes
     *
     * @param {string} string
     * @returns
     * @memberof Utils
     */
    stringToBytes(string: string) {
        var array = new Uint8Array(string.length);
        for (var i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }

    /**
     * Bytes to hex string
     *
     * @param {Uint8Array} byte
     * @returns
     * @memberof Utils
     */
    bytes2HexString(byte: Uint8Array) {
        const getBytes = (str: any) => {
            return str.charCodeAt(0)
        }
        let hex = "0123456789ABCDEF".split('').map(getBytes)
        if (!byte) return
        let buff = new Uint8Array(2 * byte.length);
        for (let i = 0; i < byte.length; i++) {
            buff[2 * i] = hex[(byte[i] >> 4) & 0x0f];
            buff[2 * i + 1] = hex[byte[i] & 0x0f];
        }
        return this.bytesToString(buff.buffer);
    }

    /**
     * Buffer to hex
     *
     * @param {*} buffer
     * @returns
     * @memberof Utils
     */
    bufToHex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
        return [...new Uint8Array(buffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Get string byte length
     *
     * @param {string} str
     * @returns
     * @memberof Utils
     */
    getStringByteLength(str: string) {
        var byteLen = 0, len = str.length;
        if (str) {
            for (var i = 0; i < len; i++) {
                if (str.charCodeAt(i) > 255) {
                    byteLen += 2;
                }
                else {
                    byteLen++;
                }
            }
            return byteLen;
        }
    }

    /**
     * Split string by size
     * use strDivision('ABCD',2), return 'AB CD'
     * @param {string} str
     * @param {number} size
     * @returns
     * @memberof Utils
     */
    strDivision(str: string, size: number) {
        let result: any = ''
        for (let i = 0; i < str.length; i++) {
            result += str[i]
            if ((i + 1) % size == 0) {
                result += ' '
            }
        }
        result = result.split(' ')
        result = result.filter((i: any) => i)
        return result.join(' ')
    }

    /**
     * Merge multiple uint8Array
     *
     * @param {*} constructor
     * @param {...any[]} arrays
     * @returns
     * @memberof Utils
     */
    concatUint(constructor: any, ...arrays: any[]) {
        let totalLength = 0
        for (let arr of arrays) {
            totalLength += arr.length
        }
        let result = new constructor(totalLength)
        let offset = 0
        for (let arr of arrays) {
            result.set(arr, offset)
            offset += arr.length
        }
        return result
    }

    /**
     * Format date
     * 
     * @param {*} date for example '2019-01-01 16:00:00' or new Date()
     * @param {*} fmt for example 'yyyy-MM-dd hh:mm:ss'
     * @returns
     * @memberof Utils
     */
    formatDate(date: any, fmt: string) {
        const padLeftZero = (str: string) => {
            return ('00' + str).substr(str.length)
        }
        // if date is string
        if (typeof date == 'string') {
            date = new Date(date)
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + ''
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
            }
        }
        return fmt
    }
}