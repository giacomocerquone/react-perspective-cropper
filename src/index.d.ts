import React from "react";
declare module "react-perspective-cropper" {
  export interface Cropper extends React.FC<CropperProps> {}

  export interface CropperState {
    loading: boolean;
    "left-bottom": { x: number; y: number };
    "left-top": { x: number; y: number };
    "right-bottom": { x: number; y: number };
    "right-top": { x: number; y: number };
  }

  export interface CropperProps {
    image: File | null | string;
    onDragStop: (s: CropperState) => void;
    onChange: (s: CropperState) => void;
    ref: React.ElementRef;
    pointSize: number;
    lineWidth: number;
    pointBgColor: string;
    pointBorder: string;
    lineColor: string;
    maxWidth: number;
    maxHeight: number;
    openCvPath: string;
  }

  export interface CropperRef extends React.ElementRef {
    backToCrop: () => void;
    /**
     * function that does the transforming, filtering, and optionally shows a preview
     */
    done: (options: Partial<ClickCropOptions>) => Promise<Blob>;
  }

  interface ClickCropOptions {
    preview: boolean;
    filterCvParams: Partial<OpenCVFilterProps>;
  }
  interface OpenCVFilterProps {
    blur: boolean;
    th: boolean;
    thMode: any;
    thMeanCorrection: number;
    thBlockSize: number;
    thMax: number;
    grayScale: boolean;
  }
}
