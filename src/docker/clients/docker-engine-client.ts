import { exec } from "child_process";
import util from "util";
import { DockerImageTag } from "../interfaces/docker-types";
import { config } from "../../config/env.config";
import { imagesPort } from "../../config/images";
import { DockerProcessHelper } from "./docker-process-helper";

const execPromise = util.promisify(exec);

export class DockerEngineClient {
  async runLogin(): Promise<void> {
    try {
      return await DockerProcessHelper.login(
        config.DOCKER_USERNAME,
        config.DOCKER_PASSWORD
      )
    } catch (error) {
      console.error("Error: ", error);
      throw error
    }
  }
  async runDownloadImage(imageInfo: DockerImageTag): Promise<void> {
    try {
      return await DockerProcessHelper.pull(
        imageInfo
      )
    } catch (error) {
      console.error("Error: ", error)
      throw error
    }
  }
  async runDownloadedImage(imageInfo: DockerImageTag): Promise<void> {
    const port = imagesPort[imageInfo.name];
    return await DockerProcessHelper.downlaod(
      port,
      imageInfo)
  }
  async stopContainer(image: DockerImageTag): Promise<void> {
    try {
      const { stdout: containerId } = await execPromise(
        ` docker ps -q -f name=${image.name}`,
      );
      const trimmedContainerId = containerId.trim();
      if (!trimmedContainerId) {
        throw new Error(
          `⚠️ No se encontró un contenedor activo para ${image.name}`,
        );
      }
      await execPromise(`docker stop ${trimmedContainerId}`);
      await execPromise(`docker rm ${trimmedContainerId}`);
      const { stdout: imageId } = await execPromise(
        `docker images --format "{{.ID}}" --filter=reference=${config.DOCKER_USERNAME}/projects:${image.name}`,
      );
      await execPromise(`docker rmi ${imageId}`);
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
