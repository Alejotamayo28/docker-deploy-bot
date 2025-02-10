"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDockerImagesKeyboard = createDockerImagesKeyboard;
function createDockerImagesKeyboard(images) {
    const keyboard = images.map((image) => [
        {
            text: image.name,
            callback_data: `select_image:${image.id}`, // Formato: acción:id
        },
    ]);
    return {
        inline_keyboard: keyboard,
    };
}
