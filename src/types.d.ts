import { ApiEndpointsTreeItem, ApiOperationListItem, ApiDocumentation, ApiNodeShapeListItem, ApiSecuritySchemeListItem } from '@api-client/amf-store';

interface SelectableMenuItem {
  /**
   * Whether the item is a selected menu item.
   */
  selected?: boolean;
  /**
   * Whether the item has secondary selection.
   * This happens when a "passive" selection has been applied to the item.
   */
  secondarySelected?: boolean;
}

interface EditableMenuItem {
  /**
   * When set the name editor for the item is enabled.
   */
  nameEditor?: boolean;
}

export declare interface EndpointItem extends ApiEndpointsTreeItem, SelectableMenuItem, EditableMenuItem {
  operations: OperationItem[];
}
export declare interface OperationItem extends ApiOperationListItem, SelectableMenuItem, EditableMenuItem {}
export declare interface DocumentationItem extends ApiDocumentation, SelectableMenuItem, EditableMenuItem {}
export declare interface NodeShapeItem extends ApiNodeShapeListItem, SelectableMenuItem, EditableMenuItem {}
export declare interface SecurityItem extends ApiSecuritySchemeListItem, SelectableMenuItem {}

export declare type EditableMenuType = 'endpoint'|'operation'|'documentation'|'schema';
export declare type SchemaAddType = 'scalar'|'object'|'file'|'array'|'union';
