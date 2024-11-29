import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { create } from 'pinch-zoom-pan';

import css from './PinchZoomPan.module.css';

interface PinchZoomPanProps {
  min?: number;
  max?: number;
  captureWheel?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  canvasRef: any;
}

export const PinchZoomPan = React.memo(
  function PinchZoomPan({ min, max, captureWheel, className, style, children, canvasRef }: PinchZoomPanProps) {
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const element = root.current;
      if (!element) return;
      canvasRef.current = create({ element, minZoom: min, maxZoom: max, captureWheel });
      canvasRef.current.update({ x: 0, y: 200, z: 0.1 });
      return canvasRef.current.destroy;
    }, [min, max, captureWheel]);

    return (
      <div ref={root} className={classNames(className, css.root)} style={style}>
        <div className={css.point}>
          <div className={css.canvas}>
            {children}
          </div>
        </div>
      </div>
    );
  },
);
