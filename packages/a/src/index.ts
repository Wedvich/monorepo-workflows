import { sharedHello } from "@monorepo/shared";

export const a = () => "a";

console.log("Package a says", sharedHello());
