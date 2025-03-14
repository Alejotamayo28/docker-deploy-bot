import { DockerImageTag } from "../../docker/interfaces/docker-types"

export interface DockerCredentials {
  userName: string,
  password: string,
  image: DockerImageTag
}

export function generateDockerSetupScript(dockerInfo: DockerCredentials): string {
  const dockerSetupScript = Buffer.from(`#!/bin/bash
    echo "Iniciando script de configuración..."
    apt-get update -y
    apt-get install -y docker.io
    systemctl start docker
    systemctl enable docker
   
    echo "Autenticando con DockerHub..."
    docker login -u ${dockerInfo.userName} --password ${dockerInfo.password}

    # Guardar información de la imagen Docker
    echo "${dockerInfo.userName}/projects:${dockerInfo.image.name}" > /tmp/docker_image
    
    # Pull de la imagen Docker
    docker pull ${dockerInfo.userName}/projects:${dockerInfo.image.name}
    
    # Ejecutar el contenedor
    docker run -d ${dockerInfo.userName}/projects:${dockerInfo.image.name}

    sudo cloud-init status --wait

    echo "Contenedor iniciado correctamente"
    `).toString('base64')
  return dockerSetupScript
}
