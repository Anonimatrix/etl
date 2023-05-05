import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path, { parse } from "path";
const cacheDir = ".cache";

type CallbackFunction = (...args: any[]) => any;

export const memoization = (
  fn: CallbackFunction,
  name = "cache",
) => {
  let cache: { [key: string]: string } = {};

  const cachedFunction: CallbackFunction = async (...args) => {
    const key = JSON.stringify(args.join('-'));
    if (cache[key] != undefined) {
      return cache[key];
    }

    const result = await fn(...args);
    Object.assign(cache, { [key]: result });

    return result;
  };

  return cachedFunction;
};
