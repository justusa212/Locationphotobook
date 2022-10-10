/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SnapshotInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSnapshotMutation
// ====================================================

export interface UpdateSnapshotMutation_updateSnapshot {
  __typename: "Snapshot";
  id: string;
  image: string;
  publicId: string;
  latitude: number;
  longitude: number;
  description: string;
  address: string;
}

export interface UpdateSnapshotMutation {
  updateSnapshot: UpdateSnapshotMutation_updateSnapshot | null;
}

export interface UpdateSnapshotMutationVariables {
  id: string;
  input: SnapshotInput;
}
