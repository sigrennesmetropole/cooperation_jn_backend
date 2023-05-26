import configuration from './configuration.json';

export function getConfig(){
    return configuration
}

export function getConfigFromKey(key: string) {
    const config = getConfig()
    const keys = key.split('.')
    let obj = config
    for (let i = 0; i < keys.length; i++) {
      if (!config.hasOwnProperty(keys[i])) {
        return null
      }
      // @ts-ignore
      obj = obj[keys[i]]
    }
    return obj
}
  