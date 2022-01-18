-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "discordToken" TEXT NOT NULL,
    "telegramToken" TEXT NOT NULL,
    "admins" JSONB NOT NULL,
    "mods" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "voiceTextChnList" JSONB NOT NULL,
    "voiceChannleJoinMsg" TEXT NOT NULL,
    "effectiveRoles" JSONB NOT NULL,

    PRIMARY KEY ("id")
);
