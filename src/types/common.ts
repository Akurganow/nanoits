export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
}

export type NullToOptional<T> = {
    [P in keyof T]: T[P] extends null ? T[P] | undefined : T[P]
}

export type RecursiveNullToOptional<T> = {
    [P in keyof T]: T[P] extends null ? T[P] | undefined : RecursiveNullToOptional<T[P]>
}