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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDockerImages = fetchDockerImages;
const axios_1 = __importDefault(require("axios"));
const env_config_1 = require("../../config/env.config");
function fetchDockerImages() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://hub.docker.com/v2/repositories/${env_config_1.config.DOCKER_USERNAME}/${env_config_1.config.DOCKER_REPO}/tags/`;
        const response = yield axios_1.default.get(url, {
            headers: { Authorization: `Bearer ${env_config_1.config.DOCKER_TOKEN}` },
        });
        return response.data.results.map((img) => ({
            id: img.id,
            repository: img.repository,
            name: img.name,
            last_updated: img.last_updated,
            last_updater_username: img.last_updater_username,
            tag_status: img.tag_status,
        }));
    });
}
