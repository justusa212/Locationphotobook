/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EditSnapshotQuery
// ====================================================

export interface EditSnapshotQuery_snapshot {
  __typename: "Snapshot";
  id: string;
  userId: string;
  address: string;
  image: string;
  publicId: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface EditSnapshotQuery {
  snapshot: EditSnapshotQuery_snapshot | null;
}

export interface EditSnapshotQueryVariables {
  id: string;
}
