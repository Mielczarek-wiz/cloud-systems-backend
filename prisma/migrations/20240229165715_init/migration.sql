-- CreateTable
CREATE TABLE "WHORegion" (
    "id" BIGSERIAL NOT NULL,
    "region" VARCHAR(255) NOT NULL,

    CONSTRAINT "WHORegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CovidStats" (
    "id" BIGSERIAL NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "confirmed" BIGINT NOT NULL,
    "deaths" BIGINT NOT NULL,
    "recovered" BIGINT NOT NULL,
    "active" BIGINT NOT NULL,
    "newCases" BIGINT NOT NULL,
    "newDeaths" BIGINT NOT NULL,
    "newRecovered" BIGINT NOT NULL,
    "confirmedLastWeek" BIGINT NOT NULL,
    "whoId" BIGINT NOT NULL,

    CONSTRAINT "CovidStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WHORegion_region_key" ON "WHORegion"("region");

-- CreateIndex
CREATE UNIQUE INDEX "CovidStats_country_key" ON "CovidStats"("country");

-- AddForeignKey
ALTER TABLE "CovidStats" ADD CONSTRAINT "CovidStats_whoId_fkey" FOREIGN KEY ("whoId") REFERENCES "WHORegion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
