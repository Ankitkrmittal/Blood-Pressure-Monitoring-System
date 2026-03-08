import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createBPReading(userId, systolic, diastolic) {
  const result = await prisma.bloodPressure.create({
    data: {
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      userId: userId
    }
  });

  return result;
}