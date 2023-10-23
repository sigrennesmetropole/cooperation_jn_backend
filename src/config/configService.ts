import NodeCache from 'node-cache'
import fetch from 'node-fetch'
import configuration from './configuration.json'
const cache = new NodeCache({
  stdTTL: 3600,
})

export async function getConfig() {
  const cacheKey = 'config'
  const cachedConfig = cache.get(cacheKey)

  if (cachedConfig) {
    return cachedConfig
  }
  if (process.env.CONF === 'local') {
    console.log('Local setup: use local configuration')
    return configuration
  }
  console.log('Server setup: use remote configuration')

  const baseUrl = `${getConfFileGithubPath()}`
  try {
    const response = await fetch(baseUrl)
    const resJson = await response.json()
    cache.set(cacheKey, resJson)
    return resJson
  } catch (error) {
    console.log('Error retrieving config', error)
  }
}

export function getConfFileGithubPath() {
  return process.env.CONF_FILE_GITHUB_PATH as string
}

export async function getConfigFromKey(key: string) {
  const config = await getConfig()
  const keys = key.split('.')
  let obj: any = config

  for (let i = 0; i < keys.length; i++) {
    if (obj.hasOwnProperty(keys[i])) {
      obj = obj[keys[i]]
    } else {
      return null
    }
  }
  return obj
}
