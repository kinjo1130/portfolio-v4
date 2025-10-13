import { prisma } from "@/libs/prisma";

export const getTursoInfo = async () => {
  return await prisma.todo.findMany();
}