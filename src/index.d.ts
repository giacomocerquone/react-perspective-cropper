import React from "react";
declare module "react-perspective-cropper" {
  export interface Cropper extends React.FC<CropperProps> {}

  export interface CropperProps {
    image: File | null;
    onDragStop: () => void;
    onChange: () => void;
    cropperRef: React.ElementRef;
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
