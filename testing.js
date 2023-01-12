const array1 = [1, 2, 3, 4, 5, 11, 2, 8]
const array2 = [1, 2, 3, 5, 6, 7, 8, 9]


function oneWayComparison(arr1, arr2)  {
    const output = arr2.filter(elem => arr1.indexOf(elem) !== -1)

    const output2 = arr1.filter(elem => arr2.indexOf(elem) !== -1)

    return [output, output2]
}


function nTwoEasyMethod(arr1, arr2) {
    let matchingElements = []

    arr1.forEach((arr1Elem, i) => {
        arr2.forEach(arr2Elem => {
            if(arr1Elem === arr2Elem) {
                matchingElements.push(arr1Elem)
            }
        })
    })

    return matchingElements
}


// THIS IS THE FUNCTION THAT WINS. O(n)
function hashMapMethod(arr1, arr2) {
    let matchingElements = []
    let hashMap = {}

    arr1.forEach((elem, i) => {
        if(hashMap[elem] !== undefined && hashMap[elem].userOne === false) {
            hashMap[elem].count += 1
        }else {
            hashMap[elem] = {
                count: 1,
                userOne: true,
                userTwo: false,
                match: false
            }
        }
    })

    arr2.forEach((elem, i) => {
        if(hashMap[elem] !== undefined && hashMap[elem].userTwo === false) {
            hashMap[elem].count += 1
            hashMap[elem].userTwo = true
            hashMap[elem].match = true
        }else {
            hashMap[elem] = {
                count: 1,
                userOne: false,
                userTwo: true,
                match: false
            }
        }
    })

    console.log(hashMap)

    for(elem in hashMap) {
        if(hashMap[elem] > 1) {
            const matchingElemInteger = parseInt(elem)

            matchingElements.push(matchingElemInteger)
        }
    }

    return matchingElements
}


const result = {
    oneWayComparison1: oneWayComparison(array1, array2)[0],
    oneWayComparison2: oneWayComparison(array1, array2)[1],
    nTwoEasyMethod: nTwoEasyMethod(array1, array2),
    hashMapMethod: hashMapMethod(array1, array2),
    expectedResult: [1, 2, 3, 5, 8]
} 


console.log(result)