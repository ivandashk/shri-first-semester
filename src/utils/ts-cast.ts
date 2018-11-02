// tslint:disable:ban-types
type Constructor<T> = Function & { prototype: T };

function cast<T>(object: Object | null, type: Constructor<T>): T {
    if (!object || !(object instanceof type)) {
        throw new TypeError();
    }
    return object as T;
}
