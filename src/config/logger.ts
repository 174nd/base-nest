import { Logger } from "@nestjs/common";

export const logger = new Logger(process.env.npm_package_name);