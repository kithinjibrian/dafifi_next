export type Type =
    | { tag: "TVar", tvar: string, accept: Type[], reject: Type[] }
    | {
        tag: "TCon";
        tcon: {
            name: string;
            types: Type[];
        };
    }

type Token = {
    type: 'IDENTIFIER' | 'KEYWORD' | 'ANGLE_BRACKET' | 'SQUARE_BRACKET' | 'COMMA' | 'EOF';
    value: string;
};

type TypeConstructor = (...args: Type[] | string[]) => Type;

// Updated type registry to handle arguments for array and map types
const typeRegistry: { [key: string]: TypeConstructor } = {
    'string': () => ({ tag: 'TCon', tcon: { name: 'string', types: [] } }),
    'int': () => ({ tag: 'TCon', tcon: { name: 'integer', types: [] } }),
    'integer': () => ({ tag: 'TCon', tcon: { name: 'integer', types: [] } }),
    'float': () => ({ tag: 'TCon', tcon: { name: 'float', types: [] } }),
    'bool': () => ({ tag: 'TCon', tcon: { name: 'boolean', types: [] } }),
    'boolean': () => ({ tag: 'TCon', tcon: { name: 'boolean', types: [] } }),
    'flow': () => ({ tag: 'TCon', tcon: { name: 'flow', types: [] } }),
    'struct': (name: string) => ({ tag: 'TCon', tcon: { name: `struct ${name}`, types: [] } }),
    'array': (elementType: Type) => ({
        tag: 'TCon',
        tcon: {
            name: 'array',
            types: [elementType]
        }
    }),
    'map': (valueType: Type) => ({
        tag: 'TCon',
        tcon: {
            name: 'map',
            types: [valueType]
        }
    })
};

export const lexer = (code: string): Token[] => {
    const keywords = ['string', 'array', 'map', 'int', 'integer', 'float', 'bool', 'boolean', 'flow', 'struct', 'accept', 'reject'];
    const tokens: Token[] = [];
    let i = 0;

    const isLetter = (char: string) => /[a-zA-Z]/.test(char);
    const isDigit = (char: string) => /[0-9]/.test(char);
    const isAlphanumeric = (char: string) => isLetter(char) || isDigit(char);
    const isWhitespace = (char: string) => /\s/.test(char);

    while (i < code.length) {
        const char = code[i];

        if (isWhitespace(char)) {
            i++;
            continue;
        }

        if (char === '<' || char === '>') {
            tokens.push({ type: 'ANGLE_BRACKET', value: char });
            i++;
            continue;
        }

        if (char === '[' || char === ']') {
            tokens.push({ type: 'SQUARE_BRACKET', value: char });
            i++;
            continue;
        }

        if (char === ',') {
            tokens.push({ type: 'COMMA', value: char });
            i++;
            continue;
        }

        if (isLetter(char)) {
            let identifier = '';
            while (i < code.length && isAlphanumeric(code[i])) {
                identifier += code[i];
                i++;
            }

            if (keywords.includes(identifier)) {
                tokens.push({ type: 'KEYWORD', value: identifier });
            } else {
                tokens.push({ type: 'IDENTIFIER', value: identifier });
            }
            continue;
        }

        throw new Error(`Unexpected character: '${char}'`);
    }

    tokens.push({ type: 'EOF', value: '' });
    return tokens;
};

export class Parser {
    private tokens: Token[];
    private current: number;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.current = 0;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private advance(): Token {
        return this.tokens[this.current++];
    }

    private match(type: Token['type'], value?: string): boolean {
        const token = this.peek();
        if (token.type === type && (value === undefined || token.value === value)) {
            this.advance();
            return true;
        }
        return false;
    }

    private expect(type: Token['type'], value?: string): Token {
        const token = this.peek();
        if (token.type === type && (value === undefined || token.value === value)) {
            return this.advance();
        }
        throw new Error(`Expected ${value ?? type}, but got '${token.value}'`);
    }

    public parse(): Type {
        return this.parseType();
    }

    private parseType(): Type {
        const val = this.peek();

        // Handle array and map types
        if (this.match('KEYWORD', 'array')) {
            this.expect('ANGLE_BRACKET', '<');
            const elementType = this.parseType();
            this.expect('ANGLE_BRACKET', '>');
            return typeRegistry['array'](elementType);
        }

        if (this.match('KEYWORD', 'map')) {
            this.expect('ANGLE_BRACKET', '<');
            const valueType = this.parseType();
            this.expect('ANGLE_BRACKET', '>');
            return typeRegistry['map'](valueType);
        }

        if (this.match('KEYWORD', 'struct')) {
            const structName = this.peek().value;
            this.advance();
            return typeRegistry['struct'](structName);
        }

        // Handle basic types (string, int, float, flow, bool)
        if (this.match('KEYWORD', 'string') ||
            this.match('KEYWORD', 'int') ||
            this.match('KEYWORD', 'integer') ||
            this.match('KEYWORD', 'float') ||
            this.match('KEYWORD', 'flow') ||
            this.match('KEYWORD', 'boolean') ||
            this.match('KEYWORD', 'bool')) {

            if (typeRegistry[val.value]) {
                if (this.match('SQUARE_BRACKET', '[')) {
                    this.expect('SQUARE_BRACKET', ']');
                    return typeRegistry['array'](typeRegistry[val.value]());
                }
                return typeRegistry[val.value]();
            }
        }

        // Handle type variables (e.g., `T0`)
        if (this.match('IDENTIFIER', val.value)) {
            let accept: Type[] = [];
            let reject: Type[] = [];

            if (this.match('KEYWORD', 'reject')) {
                do {
                    const elementType = this.parseType();
                    reject.push(elementType);
                } while (this.match('COMMA'))
            }

            if (this.match('KEYWORD', 'accept')) {
                do {
                    const elementType = this.parseType();
                    accept.push(elementType);
                } while (this.match('COMMA'))
            }

            return { tag: 'TVar', tvar: val.value, accept, reject };
        }

        // Error if no matching type
        throw new Error(`Unexpected token: '${this.peek().value}'`);
    }
}

export const parse = (code: string): Type => {
    const tokens = lexer(code);
    const parser = new Parser(tokens);
    return parser.parse();
};