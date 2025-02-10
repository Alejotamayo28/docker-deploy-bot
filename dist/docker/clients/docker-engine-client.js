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
exports.DockerEngineClient = void 0;
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const env_config_1 = require("../../config/env.config");
const images_1 = require("../../config/images");
const execPromise = util_1.default.promisify(child_process_1.exec);
class DockerEngineClient {
    runLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new Promise((resolve, reject) => {
                    const dockerLogin = (0, child_process_1.spawn)("sudo", [
                        "docker",
                        "login",
                        "-u",
                        env_config_1.config.DOCKER_USERNAME,
                        "--password-stdin",
                    ]);
                    let stdoutData = "";
                    let stderrData = "";
                    dockerLogin.stdin.write(`${env_config_1.config.DOCKER_PASSWORD}\n`);
                    dockerLogin.stdin.end();
                    dockerLogin.stdout.on("data", (data) => {
                        stdoutData += data.toString();
                    });
                    dockerLogin.stderr.on("data", (data) => {
                        stderrData += data.toString();
                    });
                    dockerLogin.on("close", (code) => {
                        if (stdoutData)
                            console.log(`Stdout: `, stdoutData);
                        if (stderrData)
                            console.log(`Stderr: `, stderrData);
                        if (code === 0) {
                            resolve();
                        }
                        else {
                            reject(new Error(`Docker login failed with code ${code}`));
                        }
                    });
                });
            }
            catch (error) {
                console.error("Error: ", error);
            }
        });
    }
    runDownloadImage(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = ["pull", `${env_config_1.config.DOCKER_USERNAME}/projects:${image.name}`];
            console.log(`Executing command: sudo docker ${args.join(" ")}`);
            return new Promise((resolve, reject) => {
                const dockerProcess = (0, child_process_1.spawn)("sudo", ["docker", ...args]);
                let stdoutData = "";
                let stderrData = "";
                dockerProcess.stdout.on("data", (data) => {
                    stdoutData += data.toString();
                });
                dockerProcess.stderr.on("data", (data) => {
                    stderrData += data.toString();
                });
                dockerProcess.on("close", (code) => {
                    if (stdoutData)
                        console.log(`Stdout: `, stdoutData);
                    if (stderrData)
                        console.log(`Stderr: `, stderrData);
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error(`El contenedor falló con código ${code}`));
                    }
                });
                dockerProcess.on("error", (error) => {
                    console.error("Error al descargar el contenedor:", error);
                    reject(error);
                });
            });
        });
    }
    runDownloadedImage(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const port = images_1.imagesPort[image.name];
            const args = [
                "run",
                "-d",
                "-p",
                `${port}:${port}`,
                "--name",
                image.name,
                `${env_config_1.config.DOCKER_USERNAME}/projects:${image.name}`,
            ];
            console.log(`Executing command: sudo docker ${args.join(" ")}`);
            return new Promise((resolve, reject) => {
                const dockerProcess = (0, child_process_1.spawn)("sudo", ["docker", ...args]);
                let stdoutData = "";
                let stderrData = "";
                dockerProcess.stdout.on("data", (data) => {
                    stdoutData += data.toString();
                });
                dockerProcess.stderr.on("data", (data) => {
                    stderrData += data.toString();
                });
                dockerProcess.on("close", (code) => {
                    if (stdoutData)
                        console.log(`Stdout: `, stdoutData);
                    if (stderrData)
                        console.log(`Stderr: `, stderrData);
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error(`El contenedor falló con código ${code}`));
                    }
                });
                dockerProcess.on("error", (error) => {
                    console.error("Error al correr el contenedor:", error);
                    reject(error);
                });
            });
        });
    }
    stopContainer(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { stdout: containerId } = yield execPromise(`sudo docker ps -q -f name=${image.name}`);
                const trimmedContainerId = containerId.trim();
                if (!trimmedContainerId) {
                    throw new Error(`⚠️ No se encontró un contenedor activo para ${image.name}`);
                }
                console.log(`Deteniendo contenedor: ${trimmedContainerId}`);
                yield execPromise(`sudo docker stop ${trimmedContainerId}`);
                console.log(`✅ Contenedor detenido`);
                console.log(`Eliminando contenedor: ${trimmedContainerId}`);
                yield execPromise(`sudo docker rm ${trimmedContainerId}`);
                console.log(`✅ Contenedor eliminado`);
                const { stdout: imageId } = yield execPromise(`sudo docker images --format "{{.ID}}" --filter=reference=${env_config_1.config.DOCKER_USERNAME}/projects:${image.name}`);
                console.log(`Eliminando imagen: ${imageId}`);
                yield execPromise(`sudo docker rmi ${imageId}`);
                console.log(`✅ Imagen eliminada`);
            }
            catch (error) {
                console.error(`❌ Error al detener/eliminar el contenedor:`, error);
                throw error;
            }
        });
    }
    runContainer(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.runLogin();
                yield this.runDownloadImage(image);
                yield this.runDownloadedImage(image);
            }
            catch (error) {
                console.error("Error: ", error);
                throw error;
            }
        });
    }
}
exports.DockerEngineClient = DockerEngineClient;
