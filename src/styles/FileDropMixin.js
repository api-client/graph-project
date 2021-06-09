import { css } from 'lit-element';

export default css`
.drop-info {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--secondary-text-color, rgba(255, 255, 255, 0.84));
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.drop-info {
  box-sizing: border-box;
  border-width: 2px;
  border-color: transparent;
  border-style: dashed;
}

.drop-target .drop-info,
.file-processing {
  display: flex;
}

.drop-target .drop-info {
  border-color: var(--file-drop-zone-border-color-active, #8f1d5a);
}

.drop-info > * {
  pointer-events: none;
}

.drop-icon {
  width: 80px;
  height: 80px;
  color: #8f1d5a;
}

.drop-message {
  font-size: 2rem;
  font-weight: 300;
}
`;
