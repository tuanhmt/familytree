import React, { useState } from 'react';
import classNames from 'classnames';
import css from './FamilyNode.module.css';
import ReactImageFallback from "react-image-fallback";

interface FamilyNodeProps {
  node: any;
  isRoot: boolean;
  isHover?: boolean;
  onClick: (id: string) => void;
  onSubClick: (id: string) => void;
  style?: React.CSSProperties;
}

export const FamilyNode = React.memo(
  function FamilyNode({ node, isRoot, isHover, onClick, onSubClick, style }: FamilyNodeProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [mouseDownTime, setMouseDownTime] = useState(0);
    const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
      setMouseDownTime(Date.now());
      setMouseDownPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = (e: React.MouseEvent) => {
      const mouseUpTime = Date.now();
      const mouseUpPos = { x: e.clientX, y: e.clientY };
      const timeDiff = mouseUpTime - mouseDownTime;
      const distance = Math.sqrt(
        Math.pow(mouseUpPos.x - mouseDownPos.x, 2) +
        Math.pow(mouseUpPos.y - mouseDownPos.y, 2)
      );

      if (timeDiff < 200 && distance < 5) {
        // Considered a click if the mouse was down for less than 200ms and moved less than 5 pixels
        onClick(node);
      }

      setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (e.buttons === 1) { // Left mouse button is pressed
        setIsDragging(true);
      }
    };

    const handleDragStart = () => {
      setIsDragging(true);
    };

    const handleDrop = (e: any) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleSubClick = () => {
      onSubClick(node.id);
    };

    return (
      <div className={css.root} style={style}>
        <div
          className={classNames(
            css.inner,
            css[node.gender],
            isRoot && css.isRoot,
            isHover && css.isHover,
          )}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        >
          {(node.order && node.order.trim() !== '') &&
            <div className={css.order}>{node.order}</div>
          }
          <div className={css.avatar}>
            <ReactImageFallback
              fallbackImage="/themes/custom/familytree/images/default_avatar.jpg"
              className={css.avatarPlaceholder}
              alt={node.fullname}
              src={node.avatar}
              draggable="false"
            />
          </div>
          <div className={css.fullname}>{node.fullname}</div>
          <div className={css.year}>{node.birth_year} {(node.death_year === "") ? "" : " - " + node.death_year}</div>
        </div>
        {node.hasSubTree && (
          <div
            className={classNames(css.sub, css[node.gender])}
            onClick={handleSubClick}
          />
        )}
      </div>
    );
  },
);
