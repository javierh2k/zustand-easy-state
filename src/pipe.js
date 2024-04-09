export const pipe = (...ops) => ops.reduce((a, b) => (arg) => b(a(arg)));
