import { Lexer, TypeChecker, Parser, Types } from "@kithinji/nac";
import { eqTypeClass, numericTypeClass, ordTypeClass, showTypeClass } from "@kithinji/nac/dist/typechecker/type";

export const structTypeClass = {
    name: "Struct",
    methods: []
};

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
        unifyTVars: true
    }, [
        "string",
        "integer",
        "float",
        "flow",
        "boolean",
        "nac"
    ])

    t.global.symbol_table.set("tc:Struct", structTypeClass);
    t.global.symbol_table.set("tc:Any", anyTypeClass);

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

    const ty = t.run(ast, {});

    if (ty !== undefined)
        return ty;
};