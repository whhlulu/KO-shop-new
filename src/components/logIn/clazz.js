const gradeList = [
    '一年级',
    '二年级',
    '三年级',
    '四年级',
    '五年级',
    '六年级',
    '初一年级',
    '初二年级',
    '初三年级',
    '高一年级',
    '高二年级',
    '高三年级',
]
let clazzList = []
for (var i=1;i<41;i++){
    clazzList.push(i+'班')
}

export {
    gradeList,
    clazzList
}