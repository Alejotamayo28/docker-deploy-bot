import axios from "axios";
import { DockerImageTag } from "../interfaces/docker-types";
import { EnvProcess } from "../../config/env.process";

export async function fetchDockerImages(Env: EnvProcess): Promise<DockerImageTag[]> {
  const url = `https://hub.docker.com/v2/repositories/${Env.DOCKER_USERNAME}/${Env.DOCKER_REPO}/tags/`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${Env.DOCKER_TOKEN}` },
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
