/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface BoundsInput {
  ne: CoordinatesInput;
  sw: CoordinatesInput;
}

export interface CoordinatesInput {
  latitude: number;
  longitude: number;
}

export interface SnapshotInput {
  address: string;
  coordinates: CoordinatesInput;
  description: string;
  image: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
