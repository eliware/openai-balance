import { path } from "@eliware/common";

const srcDir = path(import.meta);
const projectRoot = path(import.meta, "..");

export { projectRoot, srcDir };
