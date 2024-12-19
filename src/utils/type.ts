import { Type } from "@/store/flow";

export const apply = (subst: Map<string, Type>, type: Type): Type | null => {
    if (type.tag === "TVar") {
        return subst.get(type.tvar) ?? type;
    } else if (type.tag === "TCon") {
        return {
            tag: "TCon",
            tcon: {
                name: type.tcon.name,
                types: type.tcon.types.map((t) => apply(subst, t)),
            }
        }
    }

    return null;
};

export const compose = (a: Map<string, Type>, b: Map<string, Type>) => {
    const union = new Map([...a, ...b]);
    return new Map(
        Array.from(union).map(([key, value]) => [
            key,
            apply(a, value),
        ])
    );
};

export const bind = (a: Type, b: Type, subst: Map<string, Type>, accept: Type[], reject: Type[]): Map<string, Type> | null => {

    if (a.tag === "TVar") {
        let rejectFound = false;
        let acceptFound = false;

        for (const rejectedType of reject) {
            try {
                const result = unify(b, rejectedType);
                if (result) {
                    rejectFound = true;
                    break;
                }
            } catch (e) {

            }
        }

        if (rejectFound) {
            throw new Error(`Type '${a.tvar}' rejects type '${b.tcon.name}'`);
        }

        if (accept.length === 0) {
            acceptFound = true;
        } else {
            for (const acceptedType of accept) {
                try {
                    const result = unify(b, acceptedType);
                    if (result) {
                        acceptFound = true;
                        break;
                    }
                } catch (e) {

                }
            }
        }

        if (!acceptFound) {
            throw new Error(`Type '${a.tvar}' does not accept type '${b.tcon.name}'`);
        }

        subst.set(a.tvar, b);
    }

    return subst;
};

export const unify = (a: Type | null, b: Type | null): Map<string, Type> | null => {
    if (a == null || b == null || a === b) return new Map();
    if (a.tag === "TVar" && b.tag === "TVar") {
        throw new Error(`Can't unify two type variables.`);
    }

    if (a.tag === "TVar") {

        const accept: Type[] = a.accept || [];
        const reject: Type[] = a.reject || [];
        return bind(a, b, new Map(), accept, reject);
    }

    if (b.tag === "TVar") {

        const accept: Type[] = b.accept || [];
        const reject: Type[] = b.reject || [];
        return bind(b, a, new Map(), accept, reject);
    }

    if (a.tag === "TCon" && b.tag === "TCon") {
        if (a.tcon.name !== b.tcon.name) throw new Error(`Type mismatch: Can't unify '${a.tcon.name}' with '${b.tcon.name}'`);

        let subst = new Map();
        for (let i = 0; i < a.tcon.types.length; i++) {
            const newSubst = unify(apply(subst, a.tcon.types[i]), apply(subst, b.tcon.types[i]));
            if (newSubst) subst = compose(subst, newSubst);
        }
        return subst;
    }

    return null;
};
