-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "secureId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_secureId_key" ON "User"("secureId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
