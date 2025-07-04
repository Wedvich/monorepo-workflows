import { sharedHello } from "@monorepo/shared";

export const b = () => "b";

console.log("Package b says", sharedHello());
