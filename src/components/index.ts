export { createAhu, type AhuComponent, type CreateAhuInput } from "./ahu";
export {
  createDuctSegment,
  type CreateDuctSegmentInput,
  type DuctSegmentComponent
} from "./duct";
export {
  createTerminalDevice,
  type CreateTerminalDeviceInput,
  type TerminalDeviceComponent,
  type TerminalDeviceType
} from "./terminal";
export {
  isEndpointComponent,
  isInlineComponent,
  type BaseComponent,
  type ComponentId,
  type EndpointComponent,
  type FlowData,
  type InlineComponent
} from "./base";

import type { AhuComponent } from "./ahu";
import type { DuctSegmentComponent } from "./duct";
import type { TerminalDeviceComponent } from "./terminal";

export type NetworkComponent =
  | AhuComponent
  | DuctSegmentComponent
  | TerminalDeviceComponent;
