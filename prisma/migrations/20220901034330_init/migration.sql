-- CreateTable
CREATE TABLE "descriptions" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "houses.userId" ON "descriptions"("user_id");
