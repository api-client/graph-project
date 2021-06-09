import { zip, unzip, strFromU8, strToU8 } from 'fflate';

/** @typedef {import('fflate').AsyncZippable} AsyncZippable */
/** @typedef {import('@api-client/amf-store').ContentFile} ContentFile */

/**
 * Stops an event and cancels it.
 * @param {Event} e The event to stop
 */
export function cancelEvent(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
}

/**
 * Reads a single file to string
 * @param {File} file A file to process
 * @return {Promise<string>} File content
 */
export async function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const t = /** @type FileReader */ (e.target);
      resolve(String(t.result));
    };
    reader.onerror = () => {
      reject(new Error(`Unable to read ${file.name} contents`));
    };
    reader.readAsText(file);
  });
}

/**
 * Reads a single file as an ArrayBuffer
 * @param {File} file A file to process
 * @return {Promise<ArrayBuffer>} File content
 */
export async function readBufferFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const t = /** @type FileReader */ (e.target);
      resolve(/** @type ArrayBuffer */ (t.result));
    };
    reader.onerror = () => {
      reject(new Error(`Unable to read ${file.name} contents`));
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Makes the browser to download a blob data.
 * @param {Blob} blob The content to download
 * @param {string} [name='domain.dm'] The file name
 */
export function downloadBlob(blob, name = 'domain.dm') {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.dispatchEvent(
    new MouseEvent('click', { 
      bubbles: true, 
      cancelable: true, 
      view: window,
    })
  );
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * @param {string} name
 * @returns {string}
 */
export function mimeFromName(name) {
  if (name.endsWith('.raml')) {
    return 'application/raml';
  }
  if (name.endsWith('.json') || name.endsWith('.jsonld')) {
    return 'application/json';
  }
  if (name.endsWith('.xml') || name.endsWith('.xsd')) {
    return 'text/xml';
  }
  return 'text/plain';
}

/**
 * @param {ArrayBuffer} buffer
 * @return {Promise<ContentFile[]>} 
 */
export async function unzipBuffer(buffer) {
  const view = new Uint8Array(buffer);
  return new Promise((resolve, reject) => {
    unzip(view, (err, unzipped) => {
      if (err) {
        if (typeof err === 'string') {
          reject(new Error(err));
        } else {
          reject(err);
        }
        return;
      }
      const result = [];
      const lastModified = new Date().getTime();
      Object.keys(unzipped).forEach((key) => {
        const fileView = unzipped[key];
        const info = /** @type ContentFile */ ({
          lastModified,
          name: key,
          size: fileView.length,
          type: mimeFromName(key),
          content: strFromU8(fileView),
        });
        result.push(info);
      });
      resolve(result);
    });
  });
}

/**
 * @param {File} file
 */
export async function unzipFiles(file) {
  let buff = /** @type ArrayBuffer */ (null);
  if (file.arrayBuffer) {
    buff = await file.arrayBuffer();
  } else {
    buff = await readBufferFile(file);
  }
  const contents = await unzipBuffer(buff);
  return contents;
}

/**
 * Creates a zip buffer from passed files.
 * @param {Record<string, string>} files
 * @returns {Promise<Uint8Array>}
 */
export async function zipFiles(files) {
  const transformedFiles = /** @type AsyncZippable */ ({});
  Object.keys(files).forEach((name) => {
    const view = strToU8(files[name]);
    transformedFiles[name] = view;
  });
  return new Promise((resolve, reject) => {
    zip(transformedFiles, {}, (err, data) => {
      if (err) {
        if (typeof err === 'string') {
          reject(new Error(err));
        } else {
          reject(err);
        }
      } else {
        resolve(data);
      }
    });
  });
}
