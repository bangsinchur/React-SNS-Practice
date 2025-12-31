import { type Database } from "./database.types";

//타입을 정제한다
export type PostEntity = Database["public"]["Tables"]["post"]["Row"];
