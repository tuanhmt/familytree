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
}

export const PinchZoomPan = React.memo(
  function PinchZoomPan({ min, max, captureWheel, className, style, children }: PinchZoomPanProps) {
    const root = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<any>(null);
    const zoomStep = 0.1;

    useEffect(() => {
      const element = root.current;
      if (!element) return;
      canvasRef.current = create({ element, minZoom: min, maxZoom: max, captureWheel });
      canvasRef.current.update({ x: 0, y: 200, z: 0.1 });
      return canvasRef.current.destroy;
    }, [min, max, captureWheel]);

    const zoomIn = () => {
      if (canvasRef.current) {
        canvasRef.current.update((prev: any) => ({ z: Math.min(prev.z + zoomStep, max || 1) }));
      }
    };

    const zoomOut = () => {
      if (canvasRef.current) {
        canvasRef.current.update((prev: any) => ({ z: Math.max(prev.z - zoomStep, min || 0.05) }));
      }
    };

    const resetZoom = () => {
      if (canvasRef.current) {
        canvasRef.current.update({ x: 0, y: 200, z: 0.1 });
      }
    };

    return (
      <div ref={root} className={classNames(className, css.root)} style={style}>
        <div className={css.point}>
          <div className={css.canvas}>
            {children}
          </div>
        </div>
        <div className="btn-toolbar mb-3 fixed-top" role="toolbar" aria-label="Family tree button groups">
          <div className="btn-group btn-group-sm me-2" role="group" aria-label="Zoom group">
            <button className='btn btn-outline-secondary' onClick={zoomIn}><i className='fa fa-plus'></i></button>
            <button className='btn btn-outline-secondary' onClick={zoomOut}><i className='fa fa-minus'></i></button>
            <button className='btn btn-outline-secondary' onClick={resetZoom}>{window.Drupal?.t('Reset') ?? 'Reset'}</button>
          </div>
          <div className="btn-group btn-group-sm" role="group">
            <button id="btnGroupDrop1" type="button" className="btn btn-outline-secondary" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fa fa-list" aria-hidden="true"></i> {window.Drupal?.t('Filter') ?? 'Filter'} <i className="fa fa-angle-down" aria-hidden="true"></i>
            </button>
            <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <li><a className="dropdown-item" href="#">Dropdown link</a></li>
              <li><a className="dropdown-item" href="#">Dropdown link</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
);
