import PropTypes from 'prop-types';

export const propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fen: PropTypes.string,
  orientation: PropTypes.string,
  turnColor: PropTypes.string,
  check: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  lastMove: PropTypes.array,
  selected: PropTypes.string,
  coordinates: PropTypes.bool,
  autoCastle: PropTypes.bool,
  viewOnly: PropTypes.bool,
  disableContextMenu: PropTypes.bool,
  resizable: PropTypes.bool,
  addPieceZIndex: PropTypes.bool,
  highlight: PropTypes.object,
  animation: PropTypes.object,
  movable: PropTypes.object,
  premovable: PropTypes.object,
  predroppable: PropTypes.object,
  draggable: PropTypes.object,
  selectable: PropTypes.object,
  onChange: PropTypes.func,
  events: PropTypes.object,
  onDropNewPiece: PropTypes.func,
  onSelect: PropTypes.func,
  items: PropTypes.object,
  drawable: PropTypes.object,
  wFaction: PropTypes.string,
  bFaction: PropTypes.string,
  wRoyalty: PropTypes.string,
  bRoyalty: PropTypes.string,
  wVisible: PropTypes.bool,
  bVisible: PropTypes.bool,
  dimensions: PropTypes.object,
};