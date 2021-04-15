import { deleteOutline } from '@advanced-rest-client/arc-icons';
import { StoreEvents } from '@api-client/amf-store';
/** @typedef {import('@api-client/context-menu').ContextMenuCommand} ContextMenuCommand */
/** @typedef {import('../GraphApiNavigationElement').default} GraphApiNavigationElement */

const commands = /** @type ContextMenuCommand[] */ ([
  {
    target: 'all',
    label: 'Expand all',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.expandAll();
    },
  },
  {
    target: 'all',
    label: 'Collapse all',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.collapseAll();
    },
  },
  {
    target: 'endpoints',
    label: 'Expand all endpoints',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.expandAllEndpoints();
    },
  },
  {
    target: 'endpoints',
    label: 'Collapse all endpoints',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.collapseAllEndpoints();
    },
  },
  {
    type: 'separator',
    target: 'all',
  },
  {
    target: 'endpoints',
    label: 'Add endpoint',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.addEndpoint();
    },
  },
  {
    target: 'endpoint',
    label: 'Delete endpoint',
    icon: deleteOutline,
    execute: (ctx) => {
      const { graphId } = ctx.target.dataset;
      if (!graphId) {
        return;
      }
      StoreEvents.Endpoint.delete(ctx.root, graphId);
    },
  },
]);
export default commands;
