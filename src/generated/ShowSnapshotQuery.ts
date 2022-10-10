/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowSnapshotQuery
// ====================================================

export interface ShowSnapshotQuery_snapshot_nearby {
  __typename: "Snapshot";
  id: string;
  latitude: number;
  longitude: number;
}

export interface ShowSnapshotQuery_snapshot {
  __typename: "Snapshot";
  id: string;
  userId: string;
  address: string;
  publicId: string;
  description: string;
  latitude: number;
  longitude: number;
  nearby: ShowSnapshotQuery_snapshot_nearby[];
}

export interface ShowSnapshotQuery {
  snapshot: ShowSnapshotQuery_snapshot | null;
}

export interface ShowSnapshotQueryVariables {
  id: string;
}
