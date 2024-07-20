import React, { useEffect, useRef } from 'react';
import '../../src/main.scss';

const Tile = ({ tile }) => {
  const tileRef = useRef(null);

  const uniqueKey = `${Date.now()}`;

  let classArray = ["tile"];
  classArray.push(`tile${tile.value}`);

  if (!tile.mergedInto) {
    classArray.push(`position_${tile.row}_${tile.column}`);
  }

  if (tile.mergedInto) {
    classArray.push("merged");
  }

  if (tile.isNew()) {
    classArray.push("new");
  }

  if (tile.hasMoved()) {
    classArray.push(`row_from_${tile.fromRow()}_to_${tile.toRow()}`);
    classArray.push(`column_from_${tile.fromColumn()}_to_${tile.toColumn()}`);
    classArray.push('isMoving');
  }

  const classes = classArray.join(' ');

  useEffect(() => {
    const handleAnimationEnd = () => {
      if (tileRef.current) {
        tileRef.current.classList.remove('new');
      }
    };

    const node = tileRef.current;
    if (node) {
      node.addEventListener('animationend', handleAnimationEnd);
    }

    return () => {
      if (node) {
        node.removeEventListener('animationend', handleAnimationEnd);
      }
    };
  }, [tile]);

  return (
    <div className={classes} ref={tileRef} key={uniqueKey}>
    </div>
  );
};

export default Tile;
