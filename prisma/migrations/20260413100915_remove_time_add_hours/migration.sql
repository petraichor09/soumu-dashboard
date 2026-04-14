/*
  Warnings:

  - You are about to drop the column `endTime` on the `OvertimeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `OvertimeRequest` table. All the data in the column will be lost.
  - Added the required column `hours` to the `OvertimeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OvertimeRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "hours" REAL NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_OvertimeRequest" ("createdAt", "date", "department", "employeeName", "id", "reason", "status") SELECT "createdAt", "date", "department", "employeeName", "id", "reason", "status" FROM "OvertimeRequest";
DROP TABLE "OvertimeRequest";
ALTER TABLE "new_OvertimeRequest" RENAME TO "OvertimeRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
