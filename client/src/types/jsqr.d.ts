declare module "jsqr" {
  type QRCodeResult = { data: string };
  type QRCodeOptions = { inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth" | "invertFirst" };
  export default function jsQR(data: Uint8ClampedArray, width: number, height: number, options?: QRCodeOptions): QRCodeResult | null;
}
