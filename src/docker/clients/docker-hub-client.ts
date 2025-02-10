import axios from "axios";
import { config } from "../../config/env.config";
import { DockerImageTag } from "../interfaces/docker-types";

export async function fetchDockerImages(): Promise<DockerImageTag[]> {
  const url = `https://hub.docker.com/v2/repositories/${config.DOCKER_USERNAME}/${config.DOCKER_REPO}/tags/`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${config.DOCKER_TOKEN}` },
  });
  return response.data.results.map((img: DockerImageTag) => ({
    id: img.id,
    repository: img.repository,
    name: img.name,
    last_updated: img.last_updated,
    last_updater_username: img.last_updater_username,
    tag_status: img.tag_status,
  }));
}
