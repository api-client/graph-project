# Graph project

AMF graph project general components and libraries, including API navigation and events.

> This is a work in progress.

This library contains general purpose web components and libraries to support AMF based API projects.
It contains definitions for components ecosystem events and API navigation.

## Usage

### Installation

```sh
npm install --save @api-client/graph-project
```

### API data model

The navigation component works with `@api-client/amf-store`. Use the store to initialize the API. The store acts as a value provider for the component. When initialized, the component dispatches a series of DOM events handled by the store to read the data from the graph.
The hosting application has to initialize the API and the graph before this element is inserted into the DOM.

```javascript
import { AmfStoreService } from '@api-client/amf-store';

const store = new AmfStoreService(window, {
  workerLocation: './node_modules/@api-client/amf-store/workers/AmfWorker.js',
});
await store.init();
const graphModel = await readDataModelSomehow();
await store.loadGraph(graphModel);
```

The navigation element queries the store once it is attached to the DOM. YOu can manually refresh the state by calling the `queryGraph()` function. You can also use the `apiId` property / attribute as declarative was of refreshing the state. When the value change (presumably the id of the web/async API) it queries for the new data.

### Endpoints sorting

By default the element renders paths for endpoints as they are declared in the API spec file. SOmetimes, however, you may want to create a tree structure from the API endpoints list. In such case set the `sort` attribute. The navigation then sorts the endpoints alphabetically and creates a view tree from endpoints. It may create a number of "virtual" endpoints which are the closest common paths between two endpoints.

For example, consider having the following endpoint paths structure defined in the API:

```yaml
smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured
smartylighting/streetlights/1/0/action/{streetlightId}/turn/on
smartylighting/streetlights/1/0/action/{streetlightId}/turn/off
smartylighting/streetlights/1/0/action/{streetlightId}/dim
```

By default the navigation render these paths as declared. When using the `sort` option the navigation renders the following tree

```yaml
smartylighting/streetlights/1/0
  /action/{streetlightId}
    /dim
    /turn/off
    /turn/on
  /event/{streetlightId}/lighting/measured
```

### Navigation list filtering

When the `filter` option is set then the navigation renders the filter text input. The user can use this input to filter menu items by any string provided in this input. Each item (depending on the item) is passed through the filter and the element only renders items that contains the user query. For example, an endpoint is filtered by its `path` and `name`. Operation is filtered by the `method` and `name`. And so on.

## Development

```sh
git clone https://github.com/@api-client/amf-store
cd amf-store
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```

## License

<!-- API Components © 2021 by Pawel Psztyc is licensed under CC BY 4.0. -->

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">API Components</span> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/jarrodek">Pawel Psztyc</a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"></a></p>
