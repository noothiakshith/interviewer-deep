-- CreateTable
CREATE TABLE "GithubAnalysis" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "techstack" TEXT[],
    "rating" DOUBLE PRECISION NOT NULL,
    "isgenuine" BOOLEAN NOT NULL,
    "detailedview" TEXT NOT NULL,
    "codequality" TEXT NOT NULL,
    "projectimpact" TEXT NOT NULL,
    "questions" TEXT[],
    "flowscore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GithubAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeAnalysis" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "name" TEXT,
    "experience" INTEGER,
    "skills" TEXT[],
    "rating" DOUBLE PRECISION,
    "feedback" TEXT,
    "redflags" TEXT[],
    "strengths" TEXT[],
    "comments" TEXT[],
    "priority" TEXT,

    CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubAnalysis_reportId_key" ON "GithubAnalysis"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeAnalysis_reportId_key" ON "ResumeAnalysis"("reportId");

-- AddForeignKey
ALTER TABLE "GithubAnalysis" ADD CONSTRAINT "GithubAnalysis_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "AiAnalysisReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "AiAnalysisReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
