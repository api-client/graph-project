import { ApiEndpointsTreeItem, ApiOperationListItem, ApiDocumentation, ApiNodeShapeListItem, ApiSecuritySchemeListItem, ApiCustomDomainPropertyListItem } from '@api-client/amf-store';

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
export declare interface CustomDomainPropertyListItem extends ApiCustomDomainPropertyListItem, SelectableMenuItem, EditableMenuItem {}

export declare type EditableMenuType = 'endpoint'|'operation'|'documentation'|'schema'|'custom-property';
export declare type SchemaAddType = 'scalar'|'object'|'file'|'array'|'union';
