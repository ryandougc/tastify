function recursion(i) {
    console.log(i);

    i++;

    if (i < 6) {
        recursion(i);
    }

    return;
}

recursion(1);
