export class Context {
  static readonly PWD =
    process.env.NODE_ENV === "development" ? "./test" : process.cwd();
}
