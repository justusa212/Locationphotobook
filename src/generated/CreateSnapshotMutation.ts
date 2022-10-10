/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SnapshotInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSnapshotMutation
// ====================================================

export interface CreateSnapshotMutation_createSnapshot {
  __typename: "Snapshot";
  id: string;
}

export interface CreateSnapshotMutation {
  createSnapshot: CreateSnapshotMutation_createSnapshot | null;
}

export interface CreateSnapshotMutationVariables {
  input: SnapshotInput;
}
