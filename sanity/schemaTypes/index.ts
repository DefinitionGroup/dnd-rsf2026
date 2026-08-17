import { blockSchemas } from "@/blocks/schemas";
import { documentTypes } from "./documents";
import { objectTypes } from "./objects";
import { page } from "./page";

export const schemaTypes = [...objectTypes, ...blockSchemas, ...documentTypes, page];
