import { TemplateResult } from "lit-html";
import { ContentFile, ImportFile } from "@api-client/amf-store";

export declare const processApiFiles: unique symbol;
export declare const processApis: unique symbol;
export declare const filesToContent: unique symbol;
export declare const readFile: unique symbol;
export declare const importApis: unique symbol;
export declare const fileInputTemplate: unique symbol;
export declare const buttonsTemplate: unique symbol;
export declare const filesHandler: unique symbol;
export declare const selectHandler: unique symbol;
export declare const cancelHandler: unique symbol;
export declare const progressTemplate: unique symbol;
export declare const apiMainFileSelectorTemplate: unique symbol;
export declare const apiFileSelectorCloseHandler: unique symbol;
export declare const acceptApiMainFile: unique symbol;
export declare const supportedFilesListTemplate: unique symbol;
export declare const afterImport: unique symbol;
export declare const apiMainFileSelectorOpenedValue: unique symbol;
export declare const processingApiImportValue: unique symbol;
export declare const importFilesValue: unique symbol;

declare function ApiImportMixin<T extends new (...args: any[]) => {}>(base: T): T & ApiImportMixinConstructor;
interface ApiImportMixinConstructor {
  new(...args: any[]): ApiImportMixin;
}

/**
 * Adds methods to support Importing API project.
 *
 * @mixin
 */
declare interface ApiImportMixin {
  readonly supportedFiles: ImportFile[];

  /** 
   * Whether the files are being processed right now.
   */
  processingApiImport: boolean;
  [processingApiImportValue]: boolean;
  /** 
   * Whether the select API main file dialog is opened.
   */
  apiMainFileSelectorOpened: boolean;
  [apiMainFileSelectorOpenedValue]: boolean;
  /** 
   * The list of files that are being imported.
   */
  importFiles: ContentFile[];
  [importFilesValue]: ContentFile[];

  /**
   * The main processing function to be called when 
   * API files are available.
   * This function decides whether to continue with import or whether additional
   * processing is required.
   */
  [processApiFiles](files: File[]): Promise<void>;

  /**
   * Imports API files into the graph store.
   */
  [processApis](files: ContentFile[], mainFile?: string): Promise<void>;

  /**
   * A function that calls the store with the files data.
   */
  [importApis](files: ContentFile[], main: string): Promise<void>;

  /**
   * Reads a single file to string
   * @param file A file to process
   * @return File content
   */
  [readFile](file: File): Promise<ContentFile>;

  /**
   * Processes files to read it's content and returns file like object with the `content` property.
   * @param files List of files to process.
   * @return File like object with `content` property.
   */
  [filesToContent](files: File[]): Promise<ContentFile[]>;

  [filesHandler](e: Event): void;

  [selectHandler](): void;

  /**
   * Called when the import has been cancelled.
   * To be implemented by the child class.
   */
  [cancelHandler](): any;

  /**
   * Called when the import finish.
   * The implementing class should use this to do some job after the import.
   */
  [afterImport](): any;

  [apiFileSelectorCloseHandler](): void;

  /**
   * A handler for the API main file dialog item selection.
   */
  [acceptApiMainFile](e: Event): void;

  /**
   * @returns The template for the file input
   */
  [fileInputTemplate](): TemplateResult;

  /**
   * @returns ApiImportMixinThe template for the action buttons
   */
  [buttonsTemplate](): TemplateResult;

  /**
   * @returns ApiImportMixinThe template for the progress bar
   */
  [progressTemplate](): TemplateResult;

  [apiMainFileSelectorTemplate](): TemplateResult;

  /**
   * @returns The template for the list of supported files to import
   */
  [supportedFilesListTemplate](): TemplateResult|TemplateResult[];
}

export { ApiImportMixinConstructor };
export { ApiImportMixin };
