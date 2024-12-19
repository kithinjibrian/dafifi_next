export const colors: Record<string, [string, string, string]> = {
    dodgerblue: ["DodgerBlue", "DodgerBlue", "text-white"],
    red: ["red", "red", "text-white"],
    green: ["green", "green", "text-white"],
    teal: ["teal", "teal", "text-white"],
    gold: ["gold", "gold", "text-white"],
    brown: ["brown", "brown", "text-white"],
    indigo: ["indigo", "indigo", "text-white"],
    cyan: ["cyan", "cyan", "text-gray-700"],
    magenta: ["magenta", "magenta", "text-white"],
};

export const valueTypeColorMap: Record<string, string> = {
    flow: "dodgerblue",
    float: "cyan",
    integer: "green",
    boolean: "red",
    string: "gold",
    struct: "indigo",
};

export const categoryColorMap: Record<string, string> = {
    Event: "teal",
    Flow: "dodgerblue",
    Action: "indigo",
    Variable: "brown",
    Query: "magenta",
    Time: "green",
    Logic: "green",
    None: "gray",
};