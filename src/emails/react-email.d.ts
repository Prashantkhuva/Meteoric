import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    bgcolor?: string;
  }
}
