import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path, { parse } from "path";
const cacheDir = ".cache";

type CallbackFunction = (...args: any[]) => any;

export const memoization = (
  fn: CallbackFunction,
  name = "cache",
  argsKey = [0]
) => {
  const cacheFilePath = path.join(__dirname, cacheDir, name + ".json");
  mkdirSync(parse(cacheFilePath).dir, { recursive: true });
  const cacheExists = existsSync(cacheFilePath);
  const cacheFile = cacheExists ? readFileSync(cacheFilePath, "utf8") : "{}";
  let cache: { [key: string]: string } = {};
  try {
    cache = JSON.parse(cacheFile);
  } catch (err) {
    console.log("Error parsing cache file", err);
  }

  const cachedFunction: CallbackFunction = async (...args) => {
    const key = JSON.stringify(args.filter((_, i) => argsKey.includes(i)));
    if (cache[key] != undefined) {
      return cache[key];
    }

    const result = await fn(...args);
    Object.assign(cache, { [key]: result });

    writeFileSync(cacheFilePath, JSON.stringify(cache));

    return result;
  };

  return cachedFunction;
};
