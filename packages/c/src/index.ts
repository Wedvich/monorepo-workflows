import { sharedHello } from "@monorepo/shared";

export const c = () => "c";

console.log("Package c says 2", sharedHello());
