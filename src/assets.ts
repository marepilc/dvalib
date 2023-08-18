'use strict'

export interface AssetsObject<T> {
  [key: string]: T
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
type CallbackFunction = () => void
type RequestCallback = (response: Blob | string) => void

interface Asset {
  id: string
  src: string
}

export class Preloader {
  public assets: Record<string, Blob | string | HTMLImageElement> = {}
  public onProgress: CallbackFunction = () => {}
  public onComplete: CallbackFunction = () => {}
  public loadingProgress = 0

  on(eventName: 'progress' | 'complete', callbackFunction: CallbackFunction) {
    switch (eventName) {
      case 'progress':
        this.onProgress = callbackFunction
        break
      case 'complete':
        this.onComplete = callbackFunction
        break
    }
  }

  load(assets: Asset[]) {
    const total = assets.length
    let loaded = 0

    const onFinishedLoading = () => {
      loaded++
      this.loadingProgress = loaded / total
      if (loaded === total) {
        this.onComplete()
      }
    }

    this.loadingProgress = 0

    assets.forEach((asset) => {
      const type = asset.src.split('.').pop()

      switch (type) {
        case 'svg':
        case 'png':
        case 'jpg':
        case 'jpeg':
          this.loadImg(asset.id, asset.src, onFinishedLoading)
          break

        case 'json':
          this.loadJson(asset.id, asset.src, onFinishedLoading)
          break

        default:
          onFinishedLoading()
          break
      }
    })
  }

  loadJson(id: string, src: string, callback: CallbackFunction) {
    this.request(src, 'text', (response) => {
      this.assets[id] = response as string
      callback()
    })
  }

  loadImg(id: string, src: string, callback: CallbackFunction) {
    this.request(src, 'blob', (response) => {
      const img = new Image()
      img.src = URL.createObjectURL(response as Blob)
      this.assets[id] = img
      img.onload = callback
    })
  }

  request(src: string, type: XMLHttpRequestResponseType, callback: RequestCallback) {
    const xhrObj = new XMLHttpRequest()
    xhrObj.onload = () => callback(xhrObj.response)
    xhrObj.open('get', src, true)
    xhrObj.responseType = type
    xhrObj.send()
  }

  getResult(id: string): Blob | string | HTMLImageElement | null {
    return this.assets[id] ?? null
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
