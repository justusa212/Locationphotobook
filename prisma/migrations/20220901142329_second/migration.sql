/*
  Warnings:

  - Added the required column `longitude` to the `descriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "descriptions" ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
