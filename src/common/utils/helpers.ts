export class Helpers {

    static shallow<T extends object>(source: any, copy : T ): T {
        Object.keys(source).forEach((key) => {
            copy[key] = source[key];
        })
        return copy
    }

}
