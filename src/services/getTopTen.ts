import { sortMapDesc } from "../lib/utils";

export async function getTopTenService(map) {
    const arrSortedDescByCount = sortMapDesc(map);

    const topTen = arrSortedDescByCount.slice(0, 10);

    return topTen;
}
