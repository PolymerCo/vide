import { VideWindowModel } from './vide-window-model'

declare type VideWindowModelCallback = (model: VideWindowModel) => void

export class VideWindowModelUpdateHandler {
  /**
   * Callback handlers for the onLoad event.
   */
  private onLoadCallbacks: VideWindowModelCallback[] = []
  /**
   * Callback handlers for the onChange event.
   */
  private onChangeCallbacks: VideWindowModelCallback[] = []

  /**
   * Current model for the window.
   */
  private currentModel?: VideWindowModel

  /**
   * Get the current model.
   */
  public get model(): VideWindowModel {
    if (!this.currentModel) throw 'cannot get model(): model not yet available'
    return this.currentModel
  }

  /**
   * Set the model.
   */
  public set model(model: VideWindowModel) {
    if (this.currentModel == null) {
      this.actionOnModelLoad(model)
    } else {
      this.actionOnModelChange(model)
    }

    this.currentModel = model
  }

  public readonly modelExpose = {
    handler: () => this,
    model: () => this.model,
  }

  /**
   * Listen to the model loading for the first time.
   * @param callback callback to run when the model loads for the first time.
   */
  public onModelLoad(callback: VideWindowModelCallback) {
    this.onLoadCallbacks.push(callback)
  }

  /**
   * Listen to the model changing.
   * @param callback callback to run when the model changes.
   */
  public onModelChange(callback: VideWindowModelCallback) {
    this.onChangeCallbacks.push(callback)
  }

  private actionOnModelLoad(model: VideWindowModel) {
    this.onLoadCallbacks.forEach((callback) => callback(model))
    this.onLoadCallbacks = []
  }

  private actionOnModelChange(model: VideWindowModel) {
    this.onChangeCallbacks.forEach((callback) => callback(model))
  }
}
