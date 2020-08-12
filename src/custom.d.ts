declare module "*.svg";
declare module "*.png";
declare module "*.gif";
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
