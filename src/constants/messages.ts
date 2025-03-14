import { DockerImageTag } from "../docker/interfaces/docker-types";

export const DOCKER_MESSAGES = {
  IMAGE_INFO: (image: DockerImageTag): string => {
    return `🐳 *Información de la Imagen*
───────────────
🆔 *Id:* ${image.id}
🏛️ *Repositorio id:* ${image.repository}
📦 *Nombre:* ${image.name}
🕒 *Última actualización:* ${new Date(image.last_updated).toLocaleString()}
👤 *Actualizado por:* ${image.last_updater_username}
🏷️ *Estado:* ${image.tag_status}`;
  },
  IMAGE_ACTION_PROMPT: (imageId: string) => {
    return `¿Qué te gustaría hacer con la imagen ${imageId}?`
  },
  IMAGE_EXECUTING: (imageId: string) => {
    return `⚙️ Instalando Docker en la instancia EC2... 🐳`
  },
  IMAGE_ON_EXECUTION: (imageName: string) => {
    return `🚀 Contenedor: ${imageName}\nEn ejecucion.`
  }
};
