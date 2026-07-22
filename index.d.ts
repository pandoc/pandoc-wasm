declare module "pandoc-wasm" {
    export const convert: (
        options: Record<string, unknown>,
        stdin: string | null,
        files?: Record<string, string | Blob>,
    ) => Promise<{
        stdout: string;
        stderr: string;
        warnings: Array<{
            type?: string;
            verbosity?: string;
            pretty?: string;
            [key: string]: unknown;
        }>;
        files: Record<string, string | Blob>;
        mediaFiles: Record<string, Blob>;
    }>;

    export const query: (
        options: {
            query:
                | "version"
                | "input-formats"
                | "output-formats"
                | "highlight-styles"
                | "highlight-languages"
                | "default-template"
                | "extensions-for-format";
            format?: string;
        },
    ) => string | string[] | object;

    export const pandoc: (
        args_str: string,
        inData: string | Blob,
        resources?: { filename: string; contents: string | Blob }[],
    ) => Promise<
        { out: string | Blob; mediaFiles: Map<string, string | Blob> }
    >;
}
