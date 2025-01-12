import {
    Lexer,
    TypeChecker,
    Parser,
    Types,
    eqTypeClass,
    numericTypeClass,
    ordTypeClass,
    showTypeClass,
    stringTypeClass
} from "@kithinji/nac";

export const anyTypeClass = {
    name: "Any",
    methods: []
};

export const parse = (code: string): Types | void => {
    const lex = new Lexer(code);
    const tks = lex.tokenize();

    tks.pop();

    const p = new Parser(tks);
    const ast = p.type();

    const t = new TypeChecker({
        unifyTVars: true,
        type_param_is_tvar: true
    }, [
        "string",
        "integer",
        "float",
        "flow",
        "boolean",
        "nac"
    ])

    t.global.symbol_table.set("tc:Any", anyTypeClass);

    t.global.symbol_table.set("tcon:string", [
        anyTypeClass,
        showTypeClass,
        stringTypeClass,
        eqTypeClass
    ])

    t.global.symbol_table.set("tcon:integer", [
        anyTypeClass,
        showTypeClass,
        numericTypeClass,
        ordTypeClass,
        eqTypeClass
    ])

    t.global.symbol_table.set("tcon:flow", [])

    t.global.symbol_table.set("tcon:boolean", [
        anyTypeClass,
        showTypeClass
    ])

    t.global.symbol_table.set("tcon:boolean", [
        anyTypeClass,
        showTypeClass
    ])

    t.global.symbol_table.set("tcon:nac", [
        anyTypeClass,
        showTypeClass
    ])

    const ty = t._run(ast, {});

    if (ty !== undefined)
        return ty;
};