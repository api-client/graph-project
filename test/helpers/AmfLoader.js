export class AmfLoader {
  static async loadApi(file='demo-api.json') {
    const url = `${window.location.protocol}//${window.location.host}/demo/${file}`;
    const response = await fetch(url);
    const result = await response.text();
    return result;
  }
};
