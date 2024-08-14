import * as core from '@actions/core'
import * as esc from '@pulumi/esc-sdk'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const config = new esc.Configuration({
      accessToken: process.env.PULUMI_ACCESS_TOKEN
    })
    const client = new esc.EscApi(config)
    const fqen = core.getInput('environment')
    const [orgName, environmentName] = fqen.split('/')
    console.log(`Opening environment ${environmentName}!`)
    const openEnvironmentResponse = await client.openEnvironment(
      orgName,
      environmentName
    )
    console.log(`Opened environment ${environmentName}!`)
    if (!openEnvironmentResponse?.id) {
      throw new Error(`Failed to open environment ${environmentName}`)
    }
    console.log('Reading open environment')
    const readEnvironmentResponse = await client.readOpenEnvironment(
      orgName,
      environmentName,
      openEnvironmentResponse?.id
    )
    console.log(readEnvironmentResponse)
    const time = new Date().toTimeString()
    core.setOutput('time', time)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
