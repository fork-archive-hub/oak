import {
  AddonObject,
  ElementObject,
  BuilderOptions,
  Component,
  ComponentObject,
  ComponentsGroup,
  ComponentOverride,
  Field,
  FieldObject,
  FieldOverride,
  TextsSheet,
  TextsSheetObject,
} from '../types';
import { Logger } from '../Logger';
import { Emitter } from '../Emitter';

export declare class Builder extends Emitter {
  constructor(opts?: {
    addons?: Array<AddonObject>,
    content?: Array<ElementObject>,
    options?: BuilderOptions,
  });

  options: BuilderOptions;
  logger: Logger;

  subscribe(cb: Function): Function;
  setAddons(addons: Array<AddonObject>): void;
  addAddon(addon: AddonObject): void;
  removeAddon(addon: AddonObject): void;
  getAvailableComponents(): Array<ComponentsGroup>;
  getComponent(type: string): Component;
  getComponentDisplayableSettings(component: Component): Array<any>;
  getAvailableFields(): Array<Field>;
  getField(type: string): Field;
  getOverride(
    type: string,
    target: Component | Field,
    options?: {
      output?: 'field';
      field?: Field;
    },
  ): ComponentOverride | FieldOverride;
  mergeOverrides(overrides: Array<ComponentOverride | FieldOverride>): void;
  getContent(): Array<ElementObject>;
  setContent(content: Array<ElementObject>, options?: { emit: boolean }): void;
  createElement(type: string, opts: {
    component?: Component;
    override?: ComponentOverride;
    baseElement?: object;
    resetIds?: boolean;
  }): object;
  addElement(element: ElementObject, options?: {
    component?: Component;
    parent?: Array<ElementObject>;
    position?: 'before' | 'after';
  }): Element;
  addElements(elements: Array<ElementObject>, options?: {
    parent?: Array<ElementObject>;
    position?: 'before' | 'after';
  }): Array<ElementObject>;
  canUndo(): boolean;
  canRedo(): boolean;
  undo(): void;
  redo(): void;
  resetHistory(): void;
}
