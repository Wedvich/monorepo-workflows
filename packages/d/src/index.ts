import { sharedHello } from "@monorepo/shared";
import { sharedDeepGoodbye } from "@monorepo/shared-deep";

export const d = () => "d";

console.log("Package d says", sharedHello(), sharedDeepGoodbye());
