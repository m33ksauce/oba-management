export default interface ILogger {
    WithFields(fields: Record<string, string>): ILogger;
    Info(msg: string): void;
    Error(name: string, msg: string): void;
}