"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCKER_MESSAGES = void 0;
exports.DOCKER_MESSAGES = {
    IMAGE_INFO: (image) => {
        return `🐳 *Información de la Imagen*
───────────────
🆔 *Id:* ${image.id}
🏛️ *Repositorio id:* ${image.repository}
📦 *Nombre:* ${image.name}
🕒 *Última actualización:* ${new Date(image.last_updated).toLocaleString()}
👤 *Actualizado por:* ${image.last_updater_username}
🏷️ *Estado:* ${image.tag_status}`;
    },
};
