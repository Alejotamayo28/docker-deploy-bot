import { DockerImageTag } from "../docker/interfaces/docker-types";

export const DOCKER_MESSAGES = {
  IMAGE_INFO: (image: DockerImageTag): string => { return `🐳 *Información de la Imagen*
───────────────
🆔 *Id:* ${image.id}
🏛️ *Repositorio id:* ${image.repository}
📦 *Nombre:* ${image.name}
🕒 *Última actualización:* ${new Date(image.last_updated).toLocaleString()}
👤 *Actualizado por:* ${image.last_updater_username}
🏷️ *Estado:* ${image.tag_status}`;
  },
};
