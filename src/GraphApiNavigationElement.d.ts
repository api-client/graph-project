import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin';
import { ApiEndPoint, ApiEndPointWithOperationsListItem, ApiOperation, ApiStoreStateCreateEvent, ApiStoreStateDeleteEvent, ApiStoreStateUpdateEvent, ApiDocumentation, ApiNodeShape } from '@api-client/amf-store';
import { EndpointItem, OperationItem, DocumentationItem, NodeShapeItem, SecurityItem, SelectableMenuItem, EditableMenuItem, EditableMenuType, SchemaAddType, CustomDomainPropertyListItem } from './types';

export declare const apiIdValue: unique symbol;
export declare const isAsyncValue: unique symbol;
export declare const queryingValue: unique symbol;
export declare const abortControllerValue: unique symbol;
export declare const selectedValue: unique symbol;
export declare const documentationsValue: unique symbol;
export declare const schemasValue: unique symbol;
export declare const securityValue: unique symbol;
export declare const endpointsValue: unique symbol;
export declare const queryValue: unique symbol;
export declare const openedEndpointsValue: unique symbol;
export declare const queryApi: unique symbol;
export declare const queryEndpoints: unique symbol;
export declare const queryDocumentations: unique symbol;
export declare const querySchemas: unique symbol;
export declare const querySecurity: unique symbol;
export declare const createFlatTreeItems: unique symbol;
export declare const getFilteredEndpoints: unique symbol;
export declare const getFilteredDocumentations: unique symbol;
export declare const getFilteredSchemas: unique symbol;
export declare const getFilteredSecurity: unique symbol;
export declare const computeEndpointPaddingValue: unique symbol;
export declare const computeEndpointPaddingLeft: unique symbol;
export declare const computeOperationPaddingValue: unique symbol;
export declare const computeOperationPaddingLeft: unique symbol;
export declare const itemClickHandler: unique symbol;
export declare const itemKeydownHandler: unique symbol;
export declare const toggleSectionClickHandler: unique symbol;
export declare const toggleSectionKeydownHandler: unique symbol;
export declare const endpointToggleClickHandler: unique symbol;
export declare const focusHandler: unique symbol;
export declare const keydownHandler: unique symbol;
export declare const summaryTemplate: unique symbol;
export declare const endpointsTemplate: unique symbol;
export declare const endpointTemplate: unique symbol;
export declare const endpointToggleTemplate: unique symbol;
export declare const operationItemTemplate: unique symbol;
export declare const documentationsTemplate: unique symbol;
export declare const documentationTemplate: unique symbol;
export declare const externalDocumentationTemplate: unique symbol;
export declare const schemasTemplate: unique symbol;
export declare const schemaTemplate: unique symbol;
export declare const securitiesTemplate: unique symbol;
export declare const securityTemplate: unique symbol;
export declare const keyDownAction: unique symbol;
export declare const keyUpAction: unique symbol;
export declare const keyShiftTabAction: unique symbol;
export declare const keyEscAction: unique symbol;
export declare const keySpaceAction: unique symbol;
export declare const shiftTabPressedValue: unique symbol;
export declare const focusedItemValue: unique symbol;
export declare const selectedItemValue: unique symbol;
export declare const focusItem: unique symbol;
export declare const listActiveItems: unique symbol;
export declare const itemsValue: unique symbol;
export declare const listSectionActiveNodes: unique symbol;
export declare const keyArrowRightAction: unique symbol;
export declare const keyArrowLeftAction: unique symbol;
export declare const makeSelection: unique symbol;
export declare const selectItem: unique symbol;
export declare const deselectItem: unique symbol;
export declare const findSelectable: unique symbol;
export declare const toggleSectionElement: unique symbol;
export declare const summarySelected: unique symbol;
export declare const filterTemplate: unique symbol;
export declare const processQuery: unique symbol;
export declare const searchHandler: unique symbol;
export declare const resetTabindices: unique symbol;
export declare const notifyNavigation: unique symbol;
export declare const addingEndpointValue: unique symbol;
export declare const addEndpointInputTemplate: unique symbol;
export declare const addEndpointKeydownHandler: unique symbol;
export declare const commitNewEndpoint: unique symbol;
export declare const cancelNewEndpoint: unique symbol;
export declare const endpointCreatedHandler: unique symbol;
export declare const endpointDeletedHandler: unique symbol;
export declare const endpointUpdatedHandler: unique symbol;
export declare const operationCreatedHandler: unique symbol;
export declare const operationUpdatedHandler: unique symbol;
export declare const operationDeletedHandler: unique symbol;
export declare const documentationCreatedHandler: unique symbol;
export declare const documentationUpdatedHandler: unique symbol;
export declare const documentationDeletedHandler: unique symbol;
export declare const schemaCreatedHandler: unique symbol;
export declare const schemaUpdatedHandler: unique symbol;
export declare const schemaDeletedHandler: unique symbol;
export declare const findViewModelItem: unique symbol;
export declare const renameInputTemplate: unique symbol;
export declare const renameKeydownHandler: unique symbol;
export declare const renameBlurHandler: unique symbol;
export declare const updateNameHandler: unique symbol;
export declare const addDocumentationInputTemplate: unique symbol;
export declare const addDocumentationKeydownHandler: unique symbol;
export declare const addingDocumentationValue: unique symbol;
export declare const addingExternalValue: unique symbol;
export declare const commitNewDocumentation: unique symbol;
export declare const externalDocumentationHandler: unique symbol;
export declare const addingSchemaValue: unique symbol;
export declare const addSchemaInputTemplate: unique symbol;
export declare const addSchemaKeydownHandler: unique symbol;
export declare const commitNewSchema: unique symbol;
export declare const addingSchemaTypeValue: unique symbol;
export declare const queryCustomProperties: unique symbol;
export declare const customPropertiesValue: unique symbol;
export declare const customPropertiesOption: unique symbol;
export declare const customPropertiesOptionChange: unique symbol;
export declare const customPropertiesTemplate: unique symbol;
export declare const customPropertyTemplate: unique symbol;
export declare const getFilteredCustomProperties: unique symbol;
export declare const addCustomPropertyInputTemplate: unique symbol;
export declare const addingCustomPropertyValue: unique symbol;
export declare const addCustomPropertyKeydownHandler: unique symbol;
export declare const commitNewCustomProperty: unique symbol;

/**
 * @fires graphload
 */
export default class GraphApiNavigationElement extends EventsTargetMixin(LitElement) {
  static get styles(): CSSResult;

  [apiIdValue]: string;
  [queryingValue]: boolean;
  [abortControllerValue]?: AbortController;
  [endpointsValue]: EndpointItem[];
  [documentationsValue]: DocumentationItem[];
  [schemasValue]: NodeShapeItem[];
  [securityValue]: SecurityItem[];
  /** 
  * The processed and final query term for the list items.
  */
  [queryValue]: string;
  /** 
  * Information read from the AMF store indicating that the currently loaded API
  * is an API.
  */
  [isAsyncValue]: boolean;
  /** 
  * Holds a list of ids of currently opened endpoints.
  */
  [openedEndpointsValue]: string[];
  /** 
  * Cached list of all list elements
  */
  [itemsValue]: HTMLElement[];
  [addingEndpointValue]?: boolean;
  [addingDocumentationValue]?: boolean;
  [addingExternalValue]?: boolean;
  [addingSchemaValue]?: boolean;
  [addingSchemaTypeValue]?: string;
  [addingCustomPropertyValue]?: boolean;

  /** 
   * When true then the element is currently querying for the graph data.
   */
  get querying(): boolean;

  /**
   * Set only when `querying`. Use to abort the query operation.
   * When calling `abort` on the controller the element stops querying and processing the graph data.
   * All data that already has been processed are not cleared.
   */
  get abortController(): AbortController | undefined;

  /**
   * @returns true when `_docs` property is set with values
   */
  get hasDocs(): boolean;

  /**
   * @returns true when has schemas definitions
   */
  get hasSchemas(): boolean;

  /**
   * @returns true when `_security` property is set with values
   */
  get hasSecurity(): boolean;

  /**
   * @returns true when `_endpoints` property is set with values
   */
  get hasEndpoints(): boolean;

  /**
   * A reference to currently selected element.
   */
  get selectedItem(): HTMLElement | undefined;

  /**
   * The currently focused item.
   */
  get focusedItem(): HTMLElement | undefined;

  /** 
   * When this property change the element queries the graph store for the data model.
   * It can be skipped when the application calls the `queryGraph()` method imperatively.
   * @attribute
   */
  apiId: string;
  /**
  * A model `@id` of selected documentation part.
  * Special case is for `summary` view. It's not part of an API
  * but most applications has some kins of summary view for the
  * API.
  * @attribute
  */
  selected: string;
  /**
   * Type of the selected item.
   * One of `documentation`, `type`, `security`, `endpoint`, `operation`
   * or `summary`.
   *
   * This property is set after `selected` property.
   * @attribute
   */
  selectedType: string;
  /**
   * If set it renders `API summary` menu option.
   * It will allow to set `selected` and `selectedType` to `summary`
   * when this option is set.
   * @attribute
   */
  summary: boolean;
  /**
   * A label for the `summary` section.
   * @attribute
   */
  summaryLabel: string;
  /**
  * Determines and changes state of documentation panel.
  * @attribute
  */
  documentationsOpened: boolean;
  /**
  * Determines and changes state of schemas (types) panel.
  * @attribute
  */
  schemasOpened: boolean;
  /**
  * Determines and changes state of security panel.
  * @attribute
  */
  securityOpened: boolean;
  /**
  * Determines and changes state of endpoints panel.
  * @attribute
  */
  endpointsOpened: boolean;
  /**
  * Filters list elements by this value when set.
  * Clear the value to reset the search.
  *
  * This is not currently exposed in element's UI due
  * to complexity of search and performance.
  * @attribute
  */
  query: string;
  /**
  * Size of endpoint indentation for nested resources.
  * In pixels.
  *
  * The attribute name for this property is `indent-size`. Note, that this
  * will change to web consistent name `indentSize` in the future.
  * @attribute
  */
  indentSize: number;
  /** 
  * By default the endpoints are rendered one-by-one as defined in the API spec file
  * without any tree structure. When this option is set it sorts the endpoints 
  * alphabetically and creates a tree structure for the endpoints.
  * Note, the resulted tree structure will likely be different to the one encoded 
  * in the API spec file.
  * @attribute
  */
  sort: boolean;
  /** 
  * When set it renders an input to filter the menu items.
  * @attribute
  */
  filter: boolean;
  /** 
   * When set the element won't query the store when attached to the DOM.
   * Instead set the `apiId` property or directly call the `queryGraph()` function.
   * @attribute
   */
  manualQuery: boolean;
  /** 
  * When set it enables graph items editing functionality.
  * The user can double-click on a menu item and edit its name.
  * @attribute
  */
  edit: boolean;

  /**
   * @returns {boolean|undefined} When set it renders the domain custom properties list in the navigation.
   * In RAML these are annotations and in OAS it's a vendor extension.
   * 
   * Note, when setting it to true it makes the element to query for the data.
   * When setting it to false, the existing data are cleared.
   * @attribute
   */
  customProperties: boolean;
  [customPropertiesOption]: boolean;
  [customPropertiesValue]: CustomDomainPropertyListItem[];
  /**
   * Determines and changes state of custom properties panel.
   * @attribute
   */
  customPropertiesOpened: boolean;

  constructor();

  /**
   * Ensures aria role attribute is in place.
   * Attaches element's listeners.
   */
  connectedCallback(): void;

  disconnectedCallback(): void;

  /**
   * Queries for the API data from the graph store.
   */
  queryGraph(): Promise<void>;

  /**
   * Queries for the current API base info.
   */
  [queryApi](signal: AbortSignal): Promise<void>;

  /**
   * Queries and sets endpoints data
   */
  [queryEndpoints](signal: AbortSignal): Promise<void>;

  /**
   * Queries and sets documentations data
   */
  [queryDocumentations](signal: AbortSignal): Promise<void>;

  /**
   * Queries and sets types (schemas) data
   */
  [querySchemas](signal: AbortSignal): Promise<void>;

  /**
   * Queries and sets security data
   */
  [querySecurity](signal: AbortSignal): Promise<void>;
  /**
   * Queries and sets the custom domain properties data.
   */
  [queryCustomProperties](signal: AbortSignal): Promise<void>;
  /**
   * A function called when the `customProperties` configuration option change.
   * It either queries for the data or clears it when the option change.
   */
  [customPropertiesOptionChange](value: boolean): Promise<void>;

  [createFlatTreeItems](items: ApiEndPointWithOperationsListItem[]): EndpointItem[];

  /**
   * Filters the current endpoints by the current query value.
   */
  [getFilteredEndpoints](): EndpointItem[] | undefined;

  /**
   * Computes `style` attribute value for endpoint item.
   * It sets padding-left property to indent resources.
   * See https://github.com/mulesoft/api-console/issues/571.
   *
   * @param indent The computed indentation of the item.
   * @returns The value for the left padding of the endpoint menu item.
   */
  [computeEndpointPaddingValue](indent?: number): string;

  /**
   * Computes endpoint list item left padding from CSS variables.
   */
  [computeEndpointPaddingLeft](): number

  /**
   * Computes `style` attribute value for an operation item.
   * It sets padding-left property to indent operations relative to a resource.
   *
   * @param indent The computed indentation of the parent resource.
   * @returns The value for the left padding of the endpoint menu item.
   */
  [computeOperationPaddingValue](indent?: number): string;

  /**
   * Computes operation list item left padding from CSS variables.
   */
  [computeOperationPaddingLeft](): number;

  /**
   * A handler for the click event on a menu list item.
   * Makes a selection from the target.
   */
  [itemClickHandler](e: MouseEvent): void;

  /**
   * A handler for the click event on endpoints toggle button.
   */
  [endpointToggleClickHandler](e: MouseEvent): void;

  /**
   * Toggles operations visibility for an endpoint.
   * @param graphId The Endpoint graph id.
   */
  toggleEndpoint(graphId: string): void;

  /**
   * A handler for the click event on a section item. Toggles the clicked section.
   */
  [toggleSectionClickHandler](e: MouseEvent): void;

  /**
   * Toggles a section of the menu represented by the element (section list item).
   */
  [toggleSectionElement](element: HTMLElement): void;

  /**
   * @returns List of documentation items filtered by the current query.
   */
  [getFilteredDocumentations](): DocumentationItem[];

  /**
   * @returns List of schemas items filtered by the current query.
   */
  [getFilteredSchemas](): NodeShapeItem[];

  /**
   * @returns List of security items filtered by the current query.
   */
  [getFilteredSecurity](): SecurityItem[];

  /**
   * @returns List of custom domain properties items filtered by the current query.
   */
  [getFilteredCustomProperties](): CustomDomainPropertyListItem[];

  /**
   * A handler for the focus event on this element.
   */
  [focusHandler](e: FocusEvent): void;

  /**
   * Sets a list item focused
   */
  [focusItem](item: HTMLElement): void;

  /**
   * Handler for the keydown event.
   */
  [keydownHandler](e: KeyboardEvent): void;

  /**
   * Handler that is called when the down key is pressed.
   *
   * @param e A key combination event.
   */
  [keyDownAction](e: KeyboardEvent): void;

  /**
   * Handler that is called when the up key is pressed.
   *
   * @param e A key combination event.
   */
  [keyUpAction](e: KeyboardEvent): void;

  /**
   * Handles shift+tab keypress on the menu.
   */
  [keyShiftTabAction](): void;

  /**
   * Handler that is called when the esc key is pressed.
   */
  [keyEscAction](): void;

  /**
   * A handler for the space bar key down.
   */
  [keySpaceAction](e: KeyboardEvent): void;

  /**
   * A handler for the key right down. Opens operations when needed.
   */
  [keyArrowRightAction](e: KeyboardEvent): void;

  /**
   * A handler for the key left down. Closes operations when needed.
   */
  [keyArrowLeftAction](e: KeyboardEvent): void;

  /**
   * Focuses on the previous item in the navigation.
   */
  focusPrevious(): void;

  /**
   * Focuses on the next item in the navigation.
   */
  focusNext(): void;

  /**
   * Selects an item in the navigation.
   * Note, this dispatches the navigation action event.
   */
  select(id: string): void;

  /**
   * Lists all HTML elements that are currently rendered in the view.
   * @returns Currently rendered items.
   */
  [listActiveItems](): HTMLElement[];

  /**
   * @param selector The prefix for the query selector
   * @returns Nodes returned from query function.
   */
  [listSectionActiveNodes](selector: string): HTMLElement[];

  /**
   * Selects an item in the menu.
   *
   * @param id The domain id of the node to be selected
   * @param type The selected type of the item.
   */
  [makeSelection](id: string, type: string): void;

  /**
   * Selects an item.
   * @param id The domain id of the menu item.
   * @param type The type of the data.
   */
  [selectItem](id: string, type: string): void;

  /**
   * Removes all selections from an item.
   * @param id The domain id of the menu item.
   * @param type The type of the data.
   */
  [deselectItem](id: string, type: string): void;

  /**
   * Finds a selectable item by its id and type.
   * @param id The domain id of the menu item.
   * @param type The type of the data.
   */
  [findSelectable](id: string, type: string): SelectableMenuItem | null;

  /**
   * @param value The new query. Empty or null to clear the query
   */
  [processQuery](value: string): void;

  /**
   * A handler for the search event from the filter input.
   */
  [searchHandler](e: Event): void;

  /**
   * Opens all sections of the menu and all endpoints.
   */
  expandAll(): void;

  /**
   * Closes all sections of the menu and all endpoints.
   */
  collapseAll(): void;

  /**
   * Opens all endpoints exposing all operations
   */
  expandAllEndpoints(): void;

  /**
   * Hides all operations and collapses all endpoints.
   */
  collapseAllEndpoints(): void;

  /**
   * Triggers a flow when the user can define a new endpoint in the navigation.
   * This renders an input in the view (in the endpoints list) where the user can enter the path name.
   */
  addEndpoint(): Promise<void>;

  /**
   * Triggers a flow when the user can define a new documentation document.
   * This renders an input in the view (in the documentation list) where the user can enter the name.
   * @param isExternal Whether the documentation is a link to a www document.
   */
  addDocumentation(isExternal?: boolean): Promise<void>;
  /**
   * Triggers a flow when the user can define a new schema in the navigation.
   * This renders an input in the view (in the schema list) where the user can enter the schema name.
   * @param type The type of the schema to add. Default to `object`.
   */
  addSchema(type?: SchemaAddType): Promise<void>;
  /**
   * Triggers a flow when the user can define a new custom property in the navigation.
   * This renders an input in the view (in the custom properties list) where the user can enter the object name.
   */
  addCustomProperty(): Promise<void>;
  /**
   * Resets all tabindex attributes to the appropriate value based on the
   * current selection state. The appropriate value is `0` (focusable) for
   * the default selected item, and `-1` (not keyboard focusable) for all
   * other items. Also sets the correct initial values for aria-selected
   * attribute, true for default selected item and false for others.
   */
  [resetTabindices](): void;

  /**
   * Dispatches the navigation event.
   * @param id The domain id of the selected node
   * @param type The domain type.
   */
  [notifyNavigation](id: string, type: string): void;

  /**
   * Event handler for the keydown event of the add endpoint input.
   */
  [addEndpointKeydownHandler](e: KeyboardEvent): void;

  /**
   * Event handler for the keydown event of the add documentation input.
   */
  [addDocumentationKeydownHandler](e: KeyboardEvent): void;
  /**
   * Event handler for the keydown event of the add schema input.
   */
  [addSchemaKeydownHandler](e: KeyboardEvent): void;
  /**
   * Event handler for the keydown event of the add custom domain property input.
   */
  [addCustomPropertyKeydownHandler](e: KeyboardEvent): void;
  [commitNewEndpoint](): Promise<void>;
  [cancelNewEndpoint](): Promise<void>;
  /**
   * @param value The title of the documentation.
   */
  [commitNewDocumentation](value?: string): Promise<void>;
  /**
   * @param value The name of the schema.
   */
  [commitNewSchema](value?: string): Promise<void>;
  /**
   * @param value The name of the custom property.
   */
  [commitNewCustomProperty](value?: string): Promise<void>;
  [endpointCreatedHandler](e: ApiStoreStateCreateEvent<ApiEndPoint>): Promise<void>;
  [endpointDeletedHandler](e: ApiStoreStateDeleteEvent): Promise<void>;
  [endpointUpdatedHandler](e: ApiStoreStateUpdateEvent<ApiEndPoint>): Promise<void>;
  [operationCreatedHandler](e: ApiStoreStateCreateEvent<ApiOperation>): Promise<void>;
  [operationUpdatedHandler](e: ApiStoreStateUpdateEvent<ApiOperation>): Promise<void>;
  [operationDeletedHandler](e: ApiStoreStateDeleteEvent): Promise<void>;
  [documentationCreatedHandler](e: ApiStoreStateCreateEvent<ApiDocumentation>): Promise<void>;
  [documentationUpdatedHandler](e: ApiStoreStateUpdateEvent<ApiDocumentation>): Promise<void>;
  [documentationDeletedHandler](e: ApiStoreStateDeleteEvent): Promise<void>;
  [schemaCreatedHandler](e: ApiStoreStateCreateEvent<ApiNodeShape>): Promise<void>;
  [schemaUpdatedHandler](e: ApiStoreStateUpdateEvent<ApiNodeShape>): Promise<void>;
  [schemaDeletedHandler](e: ApiStoreStateDeleteEvent): Promise<void>;

  /**
   * Triggers a rename action for the menu item identified by the `id`.
   * @param id The domain id of the item to edit.
   */
  renameAction(id: string): Promise<void>;

  /**
   * @param {string} id The domain id of the item to find.
   */
  [findViewModelItem](id: string): SelectableMenuItem & EditableMenuItem | null;

  /**
   * A key down event handler on the rename input
   */
  [renameKeydownHandler](e: KeyboardEvent): Promise<void>;

  /**
   * A blur event handler on the rename input
   */
  [renameBlurHandler](e: Event): Promise<void>;

  /**
   * Updates the name or the display name of the menu object
   * @param id The id of the domain object to update
   * @param value The new value.
   * @param type The object type
   * @returns A promise when the update operation finish.
   */
  [updateNameHandler](id: string, value: string, type: EditableMenuType): Promise<void>;

  /**
   * Click handler for the external navigation item.
   * Dispatches the external navigation event. When this event is handled (cancelled)
   * the original event is cancelled to prevent default behavior.
   */
  [externalDocumentationHandler](e: Event): void;

  render(): TemplateResult;

  /**
   * @returns The template for the summary filed.
   */
  [summaryTemplate](): TemplateResult | string;

  /**
   * @returns The template for the list of endpoints.
   */
  [endpointsTemplate](): TemplateResult | string;

  /**
   * @returns The template for an endpoint.
   */
  [endpointTemplate](item: EndpointItem): TemplateResult;

  /**
   * @param id The domain id of the endpoint.
   * @returns The template for endpoint's toggle button.
   */
  [endpointToggleTemplate](id: string): TemplateResult;

  /**
   * @param item The endpoint definition 
   * @param op The operation definition.
   * @returns The template for an operation list item.
   */
  [operationItemTemplate](item: EndpointItem, op: OperationItem): TemplateResult;

  /**
   * @returns The template for the documentations section.
   */
  [documentationsTemplate](): TemplateResult | string;

  /**
   * @returns The template for the documentation list item.
   */
  [documentationTemplate](item: DocumentationItem): TemplateResult;

  /**
   * @returns The template for the external documentation list item.
   */
  [externalDocumentationTemplate](item: DocumentationItem): TemplateResult;

  /**
   * @returns The template for the types (schemas) section.
   */
  [schemasTemplate](): TemplateResult | string;

  /**
   * @returns The template for the documentation list item.
   */
  [schemaTemplate](item: NodeShapeItem): TemplateResult;

  /**
   * @returns The template for the security section.
   */
  [securitiesTemplate](): TemplateResult | string;

  /**
   * @returns The template for the security list item.
   */
  [securityTemplate](item: SecurityItem): TemplateResult;

  /**
   * @returns The template for the custom domain properties section.
   */
  [customPropertiesTemplate](): TemplateResult | string;

  /**
   * @returns The template for the security list item.
   */
  [customPropertyTemplate](item: CustomDomainPropertyListItem): TemplateResult;

  /**
   * @returns The template for the filter input.
   */
  [filterTemplate](): TemplateResult | string;
  /**
   * @return The template for the new endpoint input.
   */
  [addEndpointInputTemplate](): TemplateResult;
  /**
   * @return The template for the new documentation input.
   */
  [addDocumentationInputTemplate](): TemplateResult;
  /**
   * @return The template for the new schema input.
   */
  [addSchemaInputTemplate](): TemplateResult;
  /**
   * @return The template for the new custom domain property input.
   */
  [addCustomPropertyInputTemplate](): TemplateResult;
  /**
   * @param id The domain id of the item being edited
   * @param label The current name to render.
   * @param type
   * @returns The template for the rename input. 
   */
  [renameInputTemplate](id: string, label: string, type: EditableMenuType): TemplateResult;
}
