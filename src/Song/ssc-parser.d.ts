declare module 'ssc-parser' {
    function parseSSC(content: string): {
        header: Record<string, string>;
        levels: Record<string, string>[];
    };
}
