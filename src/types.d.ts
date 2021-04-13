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

export declare interface EndpointItem extends ApiEndpointsTreeItem, SelectableMenuItem {}
export declare interface OperationItem extends ApiOperationListItem, SelectableMenuItem {}
export declare interface DocumentationItem extends ApiDocumentation, SelectableMenuItem {}
export declare interface NodeShapeItem extends ApiNodeShapeListItem, SelectableMenuItem {}
export declare interface SecurityItem extends ApiSecuritySchemeListItem, SelectableMenuItem {}
