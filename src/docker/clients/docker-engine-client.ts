import { exec, spawn } from "child_process";
import util from "util";
import { DockerImageTag } from "../interfaces/docker-types";
import { config } from "../../config/env.config";
import {  imagesPort } from "../../config/images";

const execPromise = util.promisify(exec);

export class DockerEngineClient {
  async runLogin(): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        const dockerLogin = spawn("sudo", [
          "docker",
          "login",
          "-u",
          config.DOCKER_USERNAME,
          "--password-stdin",
        ]);
        let stdoutData = "";
        let stderrData = "";
        dockerLogin.stdin.write(`${config.DOCKER_PASSWORD}\n`);
        dockerLogin.stdin.end();
        dockerLogin.stdout.on("data", (data) => {
          stdoutData += data.toString();
        });
        dockerLogin.stderr.on("data", (data) => {
          stderrData += data.toString();
        });
        dockerLogin.on("close", (code) => {
          if (stdoutData) console.log(`Stdout: `, stdoutData);
          if (stderrData) console.log(`Stderr: `, stderrData);
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Docker login failed with code ${code}`));
          }
        });
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  }
  async runDownloadImage(image: DockerImageTag): Promise<void> {
    const args = ["pull", `${config.DOCKER_USERNAME}/projects:${image.name}`];
    console.log(`Executing command: sudo docker ${args.join(" ")}`);
    return new Promise((resolve, reject) => {
      const dockerProcess = spawn("sudo", ["docker", ...args]);
      let stdoutData = "";
      let stderrData = "";
      dockerProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });
      dockerProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
      });
      dockerProcess.on("close", (code) => {
        if (stdoutData) console.log(`Stdout: `, stdoutData);
        if (stderrData) console.log(`Stderr: `, stderrData);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`El contenedor falló con código ${code}`));
        }
      });
      dockerProcess.on("error", (error) => {
        console.error("Error al descargar el contenedor:", error);
        reject(error);
      });
    });
  }
  async runDownloadedImage(image: DockerImageTag): Promise<void> {
    const port = imagesPort[image.name];
    const args = [
      "run",
      "-d",
      "-p",
      `${port}:${port}`,
      "--name",
      image.name,
      `${config.DOCKER_USERNAME}/projects:${image.name}`,
    ];
    console.log(`Executing command: sudo docker ${args.join(" ")}`);
    return new Promise((resolve, reject) => {
      const dockerProcess = spawn("sudo", ["docker", ...args]);
      let stdoutData = "";
      let stderrData = "";
      dockerProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });
      dockerProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
      });
      dockerProcess.on("close", (code) => {
        if (stdoutData) console.log(`Stdout: `, stdoutData);
        if (stderrData) console.log(`Stderr: `, stderrData);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`El contenedor falló con código ${code}`));
        }
      });
      dockerProcess.on("error", (error) => {
        console.error("Error al correr el contenedor:", error);
        reject(error);
      });
    });
  }

  async stopContainer(image: DockerImageTag): Promise<void> {
    try {
      const { stdout: containerId } = await execPromise(
        `sudo docker ps -q -f name=${image.name}`,
      );
      const trimmedContainerId = containerId.trim();
      if (!trimmedContainerId) {
        throw new Error(
          `⚠️ No se encontró un contenedor activo para ${image.name}`,
        );
      }
      console.log(`Deteniendo contenedor: ${trimmedContainerId}`);
      await execPromise(`sudo docker stop ${trimmedContainerId}`);
      console.log(`✅ Contenedor detenido`);
      console.log(`Eliminando contenedor: ${trimmedContainerId}`);
      await execPromise(`sudo docker rm ${trimmedContainerId}`);
      console.log(`✅ Contenedor eliminado`);
      const { stdout: imageId } = await execPromise(
        `sudo docker images --format "{{.ID}}" --filter=reference=${config.DOCKER_USERNAME}/projects:${image.name}`,
      );
      console.log(`Eliminando imagen: ${imageId}`);
      await execPromise(`sudo docker rmi ${imageId}`);
      console.log(`✅ Imagen eliminada`);
    } catch (error) {
      console.error(`❌ Error al detener/eliminar el contenedor:`, error);
      throw error;
    }
  }

  async runContainer(image: DockerImageTag): Promise<void> {
    try {
      await this.runLogin();
      await this.runDownloadImage(image);
      await this.runDownloadedImage(image);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }
}
