import { css } from 'lit-element';

export default css`
:host {
  display: block;
}

.centered {
  margin: 0 auto;
  width: 700px;
}

.text-centered {
  text-align: center;
}

.supported-files {
  width: auto;
  text-align: left;
  display: inline-block;
}

.files-list .file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-item {
  display: flex;
  align-items: center;
}

`;
