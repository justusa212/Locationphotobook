import {ObjectType,InputType,Field,ID,Float,Int,Resolver,Query,Mutation,Arg,Ctx,Authorized,} from "type-graphql";
import { Min, Max } from "class-validator";
import { getBoundsOfDistance } from "geolib";
import * as context from "./context";
  
  @InputType()
  class CoordinatesInput {
    @Min(-90)
    @Max(90)
    @Field((_type) => Float)
    latitude!: number;
  
    @Min(-180)
    @Max(180)
    @Field((_type) => Float)
    longitude!: number;
  }

  @InputType()
  class BoundsInput {
    @Field((_type) => CoordinatesInput)
    sw!: CoordinatesInput;

    @Field((_type) => CoordinatesInput)
    ne!: CoordinatesInput;
} 
  
  @InputType()
  class SnapshotInput {
    @Field((_type) => String)
    address!: string;
  
    @Field((_type) => String)
    image!: string;
  
    @Field((_type) => CoordinatesInput)
    coordinates!: CoordinatesInput;
  
    @Field((_type) => String)
    description!: string;
  }
  
  @ObjectType()
  class Snapshot {
    @Field((_type) => ID)
    id!: number;
  
    @Field((_type) => String)
    userId!: string;
  
    @Field((_type) => Float)
    latitude!: number;
  
    @Field((_type) => Float)
    longitude!: number;
  
    @Field((_type) => String)
    address!: string;
  
    @Field((_type) => String)
    image!: string;
  
    @Field((_type) => String)
    publicId(): string {
      const parts = this.image.split("/");
      return parts[parts.length - 1];
    }
  
    @Field((_type) => String)
    description!: string;

    @Field((_type) => [Snapshot])
    async nearby(@Ctx() ctx: context.Context) {
      const bounds = getBoundsOfDistance(
        { latitude: this.latitude, longitude: this.longitude },
        10000
      );
  
      return ctx.prisma.snapshot.findMany({
        where: {
          latitude: { gte: bounds[0].latitude, lte: bounds[1].latitude },
          longitude: { gte: bounds[0].longitude, lte: bounds[1].longitude },
          id: { not: { equals: this.id } },
        },
        take: 25,
      });
    }
  }
  
  @Resolver()
  export class SnapshotResolver {

    @Query((_returns) => Snapshot, { nullable: true })
    async snapshot(@Arg("id") id: string, @Ctx() ctx: context.Context) {
      return await ctx.prisma.snapshot.findUnique({ where: { id: parseInt(id, 10) } });
    }

    @Query((_returns) => [Snapshot], { nullable: false })
    async snapshots(@Arg("bounds") bounds: BoundsInput, @Ctx() ctx: context.Context) {
      return ctx.prisma.snapshot.findMany({
        where: {
          latitude: { gte: bounds.sw.latitude, lte: bounds.ne.latitude },
          longitude: { gte: bounds.sw.longitude, lte: bounds.ne.longitude },
        },
        take: 50,
      });
    }
  
    @Authorized()
    @Mutation((_returns) => Snapshot, { nullable: true })
    async createSnapshot(@Arg("input") input: SnapshotInput,@Ctx() ctx: context.AuthorizedContext) {
      return await ctx.prisma.snapshot.create({
        data: {
          userId: ctx.uid,
          image: input.image,
          address: input.address,
          latitude: input.coordinates.latitude,
          longitude: input.coordinates.longitude,
          description: input.description,
        },
      });
    }
  

  @Authorized()
  @Mutation((_returns) => Snapshot, { nullable: true })
  async updateSnapshot(
    @Arg("id") id: string,
    @Arg("input") input: SnapshotInput,
    @Ctx() ctx: context.AuthorizedContext
  ) {
    const snapshotId = parseInt(id, 10);
    const snapshot = await ctx.prisma.snapshot.findUnique({ where: { id: snapshotId } });

    if (!snapshot || snapshot.userId !== ctx.uid) return null;

    return await ctx.prisma.snapshot.update({
      where: { id: snapshotId },
      data: {
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        description: input.description,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => Boolean, { nullable: false })
  async deleteSnapshot(
    @Arg("id") id: string,
    @Ctx() ctx: context.AuthorizedContext): Promise<boolean> {
    const snapshotId = parseInt(id, 10);
    const snapshot = await ctx.prisma.snapshot.findUnique({ where: { id: snapshotId } });

    if (!snapshot || snapshot.userId !== ctx.uid) return false;

    await ctx.prisma.snapshot.delete({
      where: { id: snapshotId },
    });
    return true;
  }
}