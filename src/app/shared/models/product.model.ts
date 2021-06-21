import {User} from "./mc.model";

export interface Product {
  description: string;
  definition: string;
  developmentManager?: User;
}
