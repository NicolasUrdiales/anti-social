import type { Tag } from "../types";

async function findTagByName(
  name: string
) {
  const response = await fetch(
    "http://localhost:4002/tags/"
  );
  if (!response.ok) {
    throw new Error(
      "Error al obtener tags"
    );
  }
  const tags = await response.json();
  const existingTag = tags.find(
    (tag: Tag ) =>
      tag.name.toLowerCase()
      === name.toLowerCase()
  );
  return existingTag || null;
}
///////////////////////////////////////////////////////////////
async function createTag(
  tagName: string
) {
  const response = await fetch(
    "http://localhost:4002/tags/create",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name: tagName,
      }),
    }
  );
  if (!response.ok) {
    throw new Error(
      "Error creando tag"
    );
  }
  return await response.json();
}
/////////////////////////////////////////////////////////////
export async function getOrCreateTags(
  tags: string[]
): Promise<string[]> {
  const tagIds: string[] = [];
  for (const tagName of tags) {
    const existingTag =
      await findTagByName(tagName);
    if (existingTag) {
      tagIds.push(existingTag._id);
    } else {
      const newTag =
        await createTag(tagName);
      tagIds.push(newTag._id);
    }
  }
  return tagIds;
}

export async function getTags(): Promise<Tag[]> {
  try {
    const respuesta = await fetch('http://localhost:4002/tags'); 
    
    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar las publicaciones');
    }

    const data: Tag[] = await respuesta.json();
    return data;
  } catch (error) {
    console.error("Error al traer los tags:", error);
    return [];
  }
}


