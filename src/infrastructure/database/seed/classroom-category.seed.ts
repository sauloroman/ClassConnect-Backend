import { ClassroomsCategories } from "../../../../generated/prisma";
import { prismaClient } from "../prisma/prisma-client";

export const generateCategories = async () => {

  const categories: ClassroomsCategories[] = [
    'matemáticas',
    'idiomas',
    'ciencia',
    'ingeniería',
    'humanidades',
    'economía',
    'arte'
  ]

  for( const category of categories ) {
    await prismaClient.categories.create({ data: { categoryName: category }})
  }

  console.log('Categorias Insertadas Correctamente')

}

(async () => {
  await generateCategories()
})()