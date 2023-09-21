import NodeCache from 'node-cache'
import fetch from 'node-fetch'

const cache = new NodeCache({
  stdTTL: 3600,
})

export async function getConfig() {
  const cacheKey = 'config'
  const cachedConfig = cache.get(cacheKey)

  if (cachedConfig) {
    return cachedConfig
  }
  const baseUrl = `https://${getEnvGithubToken()}@raw.githubusercontent.com/sigrennesmetropole/cooperation_jn_conf/main/configuration.json`

  try {
    const response = await fetch(baseUrl)
    const resJson = await response.json()
    cache.set(cacheKey, resJson)
    return resJson
  } catch (error) {
    console.log('Error retrieving config', error)
  }
}

export function getEnvGithubToken() {
  return process.env.GITHUB_CONFIG_TOKEN as string
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
