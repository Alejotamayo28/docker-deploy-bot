export interface DockerImageTag {
  id: number;
  repository: number;
  name: string;
  last_updated: Date;
  last_updater_username: string;
  tag_status: string;
}
