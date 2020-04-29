module.exports = function toArray(string) {
   return string.split(',').map((tech) => tech.trim());
}