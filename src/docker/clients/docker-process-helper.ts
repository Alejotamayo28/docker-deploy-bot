import { spawn } from "child_process"
import { config } from "../../config/env.config"
import { DockerImageTag, ProcessResult } from "../interfaces/docker-types"


export class DockerProcessHelper {
  private static async runProcess(command: string[], inputText?: string): Promise<ProcessResult> {
    console.log(`[DockerProcessHelper] Ejecutando comando: docker ${command.join(" ")}`)
    return await new Promise((resolve, reject) => {
      const dockerProcess = spawn("sudo", ["docker", ...command])
      let stdout = ''
      let stderr = ''
      if (inputText) {
        dockerProcess.stdin.write(`${inputText}\n`)
        dockerProcess.stdin.end()
      }
      dockerProcess.stdout.on("data", (data) => {
        stdout += data.toString()
      })
      dockerProcess.stderr.on("data", (data) => {
        stderr += data.toString()
      })
      dockerProcess.on("close", (code) => {
        console.log(`[DockerProcessHelper] Ejecucion comando completada, con la salidas: ${code}`)
        if (stdout) console.log('Stdout: ', stdout)
        if (stderr) console.log('Stderr: ', stderr)
        resolve({
          stdout,
          stderr,
          code: code || 0
        })
      })
      dockerProcess.on("error", (error) => {
        reject(error)
      })
    })
  }
  static async login(username: string, password: string) {
    try {
      const result = await this.runProcess(
        ["login", "-u", username, "--password-stdin"], password)
      if (result.code != 0) throw new Error(`Docker login failed with code: ${result.code}`)
    }
    catch (error) {
      console.error('Error during Docker login: ', error)
    }
  }
  static async pull(imageInfo: DockerImageTag) {
    try {
      const result = await this.runProcess(
        ['pull', `${config.DOCKER_USERNAME}/projects:${imageInfo.name}`])
      if (result.code != 0) throw new Error(`Docker pull failed with code: ${result.code}`)
    } catch (error) {
      console.error('Error during Docker pull: ', error)
    }
  }
  static async downlaod(port: number, imageInfo: DockerImageTag) {
    try {
      const result = await this.runProcess([
        "run", "-d","-p",
        `${port}:${port}`,
        "--name",
        imageInfo.name,
        `${config.DOCKER_USERNAME}/projects:${imageInfo.name}`,
      ])
      if (result.code != 0) throw new Error(`Docker pull failed with code: ${result.code}`)
    } catch (error) {
      console.error('Error during Docker pull: ', error)
    }
  }
}
