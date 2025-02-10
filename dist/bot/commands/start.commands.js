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
exports.setupStartCommand = setupStartCommand;
const admin_auth_1 = require("../../auth/admin.auth");
const docker_hub_client_1 = require("../../docker/clients/docker-hub-client");
const __1 = require("../..");
const docker_images_keyboard_1 = require("../keyboards/docker-images.keyboard");
const docker_image_handler_1 = require("../handlers/docker-image-handler");
function setupStartCommand() {
    __1.bot.command("start", (ctx) => __awaiter(this, void 0, void 0, function* () {
        if ((0, admin_auth_1.checkValidateId)(ctx.from.id)) {
            const images = yield (0, docker_hub_client_1.fetchDockerImages)();
            const keyboard = (0, docker_images_keyboard_1.createDockerImagesKeyboard)(images);
            yield ctx.reply("Selecciona una de las siguientes imagenes: ", {
                reply_markup: keyboard,
            });
            return (0, docker_image_handler_1.setUpDockerImageHandler)(images);
        }
    }));
}
