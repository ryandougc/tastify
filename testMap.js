let testMap = new Map();
let max = {
    key: undefined,
    value: undefined,
};

testMap
    .set("d", { count: [1, 2, 3] })
    .set("b", { count: [4, 5, 6] })
    .set("c", { count: [7, 8, 9] })
    .set("a", { count: ["A", "B", "C"] })
    .set("e", { count: ["D", "E", "F"] });

let array = Array.from(testMap, ([name, value]) => ({ name, value }));

console.log(array);
