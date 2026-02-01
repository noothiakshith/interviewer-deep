/*
  Warnings:

  - The `detailedview` column on the `GithubAnalysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `codequality` column on the `GithubAnalysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `projectimpact` column on the `GithubAnalysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GithubAnalysis" DROP COLUMN "detailedview",
ADD COLUMN     "detailedview" TEXT[],
DROP COLUMN "codequality",
ADD COLUMN     "codequality" TEXT[],
DROP COLUMN "projectimpact",
ADD COLUMN     "projectimpact" TEXT[];
