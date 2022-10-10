import { buildSchemaSync, Resolver, Query } from "type-graphql";
import { authChecker } from "./auth";
import { ImageResolver } from "./image";
import { SnapshotResolver } from "./snapshot";

export const schema = buildSchemaSync({
  resolvers: [ImageResolver, SnapshotResolver],
  emitSchemaFile: process.env.NODE_ENV === "development",
  authChecker,
});