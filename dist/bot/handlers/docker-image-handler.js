"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpDockerImageHandler = setUpDockerImageHandler;
const __1 = require("../..");
const messages_1 = require("../../constants/messages");
const docker_engine_client_1 = require("../../docker/clients/docker-engine-client");
function setUpDockerImageHandler(images) {
    return __awaiter(this, void 0, void 0, function* () {
        __1.bot.action(/^select_image:(\d+)$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                const imageId = ctx.match[1];
                yield ctx.answerCbQuery(`Imagen seleccionada: ${imageId}`);
                yield ctx.reply(`Que te gustaria hacer con la imagen: ${imageId}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "🚀 Ejecutar", callback_data: `run_image:${imageId}` },
                                { text: "ℹ️ Info", callback_data: `info_image:${imageId}` },
                            ],
                        ],
                    },
                });
            }
            catch (error) {
                console.error("Error: ", error);
            }
        }));
        const dockerEngine = new docker_engine_client_1.DockerEngineClient();
        __1.bot.action(/^run_image:(\d+)$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                const imageId = ctx.match[1];
                yield ctx.answerCbQuery();
                const message01 = yield ctx.reply(`Ejecutando imagen: ${imageId}...`);
                const imageInfo = images.find((image) => {
                    return image.id == Number(imageId);
                });
                yield dockerEngine.runContainer(imageInfo);
                yield ctx.deleteMessage(message01.message_id);
                yield ctx.reply(`🚀 Contenedor: ${imageInfo === null || imageInfo === void 0 ? void 0 : imageInfo.name}\nEn ejecucion.`);
                return yield ctx.reply(`Que te gustaria hacer con la imagen: ${imageId}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🚀 Dentener", callback_data: `stop_image:${imageId}` }],
                        ],
                    },
                });
            }
            catch (error) {
                console.error(`Error: `, error);
            }
        }));
        __1.bot.action(/^stop_image:(\d+)$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            const imageId = ctx.match[1];
            const imageInfo = images.find((image) => {
                return image.id == Number(imageId);
            });
            yield dockerEngine.stopContainer(imageInfo);
            yield ctx.reply(`✅ El contenedor ha sido detenido.`);
        }));
        __1.bot.action(/^info_image:(\d+)$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                const imageId = ctx.match[1];
                yield ctx.answerCbQuery();
                yield ctx.reply(`Informacion imagen: ${imageId}...`);
                const imageInfo = images.find((image) => {
                    return image.id == Number(imageId);
                });
                console.log("Images: ", imageInfo);
                return yield ctx.reply(messages_1.DOCKER_MESSAGES.IMAGE_INFO(imageInfo), {
                    parse_mode: "Markdown",
                });
            }
            catch (error) {
                console.error("Error: ", error);
            }
        }));
    });
}
