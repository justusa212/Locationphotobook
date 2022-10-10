/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SnapshotsQuery
// ====================================================

export interface SnapshotsQuery_snapshots {
  __typename: "Snapshot";
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  publicId: string;
  description: string;
}

export interface SnapshotsQuery {
  snapshots: SnapshotsQuery_snapshots[];
}

export interface SnapshotsQueryVariables {
  bounds: BoundsInput;
}
