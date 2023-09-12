import configuration from "./configuration.json";

export function getConfig() {
  return configuration;
}

export function getConfigFromKey(key: string) {
  const config = getConfig();
  const keys = key.split(".");
  let obj: any = config;

  for (let i = 0; i < keys.length; i++) {
    if (obj.hasOwnProperty(keys[i])) {
      obj = obj[keys[i]];
    }
    return null;
  }
  return obj;
}
