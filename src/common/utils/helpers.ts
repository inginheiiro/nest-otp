export class Helpers {

    static shallow<T extends object>(source: any, copy : T ): T {
        Object.keys(source).forEach((key) => {
            copy[key] = source[key];
        })
        return copy
    }

    static arrayToObject(array: any, keyField:string ): any {
        return array.reduce((obj, item) => {
            obj[item[keyField]] = item
            return obj
        });
    }



}
