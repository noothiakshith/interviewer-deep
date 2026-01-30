-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "github" TEXT NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);
