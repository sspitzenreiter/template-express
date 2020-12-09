
exports.onlyUniqueArray=(value, index, self) =>{
    return self.indexOf(value) === index;
}