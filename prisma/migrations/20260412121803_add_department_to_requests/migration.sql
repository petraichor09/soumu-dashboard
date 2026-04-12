/*
  Warnings:

  - Added the required column `department` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `OvertimeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LeaveRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_LeaveRequest" ("createdAt", "employeeName", "endDate", "id", "reason", "startDate", "status") SELECT "createdAt", "employeeName", "endDate", "id", "reason", "startDate", "status" FROM "LeaveRequest";
DROP TABLE "LeaveRequest";
ALTER TABLE "new_LeaveRequest" RENAME TO "LeaveRequest";
CREATE TABLE "new_OvertimeRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_OvertimeRequest" ("createdAt", "date", "employeeName", "endTime", "id", "reason", "startTime", "status") SELECT "createdAt", "date", "employeeName", "endTime", "id", "reason", "startTime", "status" FROM "OvertimeRequest";
DROP TABLE "OvertimeRequest";
ALTER TABLE "new_OvertimeRequest" RENAME TO "OvertimeRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
