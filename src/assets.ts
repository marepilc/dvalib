'use strict'

export interface AssetsObject {
  [key: string]: any
}

export interface AssetsItem {
  id: string
  src: string
}

export const assetList: AssetsItem[] = []

/**
 * The `Preloader` class is used to preload assets to the visualization.
 * This class works with the still images stored as 'svg', 'png' or 'jpg' files,
 * and also with the data in the *JSON* format.
 * User should not to use this class directly. It is use by the `LimeViz` library
 * behind the scene, when {@link loadAssets} and {@link addAsset} functions are used.
 */
export class Preloader {
  public assets: any
  public onProgress: () => void
  public onComplete: () => void
  public loadingProgress: number
  public loadAssets: any

  constructor() {
    this.assets = {}

    this.onProgress = () => {}
    this.onComplete = () => {}

    this.loadingProgress = 0
  }

  on(eventName: string, callbackFunction: () => void) {
    switch (eventName) {
      case 'progress':
        this.onProgress = callbackFunction
        break
      case 'complete':
        this.onComplete = callbackFunction
        break
    }
  }

  load(assets: any[]) {
    const total: number = assets.length

    let loaded: number = 0

    const onFinishedLoading = () => {
      loaded++

      this.loadingProgress = loaded / total
      if (loaded == total) {
        this.onComplete()
      }
    }
    this.loadingProgress = 0
    for (let count = 0; count < total; count++) {
      const id = assets[count].id
      const src = assets[count].src

      const type = src.split('.').pop()

      switch (type) {
        case 'svg':
        case 'png':
        case 'jpg':
        case 'jpeg':
          this.loadImg(id, src, onFinishedLoading)
          break

        // JSON files.
        case 'json':
          this.loadJson(id, src, onFinishedLoading)
          break

        // Default case for unsupported file types.
        default:
          onFinishedLoading()
          break
      }
    }
  }

  loadJson(id: string, src: string, callback: () => void) {
    this.request(src, 'json', (response) => {
      this.assets[id] = response

      callback()
    })
  }

  loadImg(id: string, src: string, callback: () => void) {
    this.request(src, 'blob', (response) => {
      const img = new Image()

      img.src = URL.createObjectURL(response)

      this.assets[id] = img

      img.onload = callback
    })
  }

  request(src: string, type: XMLHttpRequestResponseType, callback: (response: any) => void) {
    const xhrObj = new XMLHttpRequest()

    xhrObj.onload = () => {
      callback(xhrObj.response)
    }

    xhrObj.open('get', src, true)
    xhrObj.responseType = type
    xhrObj.send()
  }

  getResult(id: string) {
    if (typeof this.assets[id] !== 'undefined') {
      return this.assets[id]
    } else {
      return null
    }
  }
}

export const preloader: Preloader = new Preloader()

/**
 * This function preloads still image from ('svg', 'png' or 'jpg') and data
 * form the JSON file. This function can be used only inside user defined `loadAssets` function,
 * which is passed as a forth parameter to the {@link dvaStart} function.
 *
 * #### Usage example
 *
 * ```typescript
 * dvaStart(setup, draw, null, loadAssets)
 *
 * function loadAssets(): void {
 *     addAsset({id: 'myImage', src: '../img/my_image.png'})
 * }
 * ```
 * @param asset Object with an asset `id` and `src` (source path)
 */
export function addAsset(asset: AssetsItem): void {
  assetList.push(asset)
}
