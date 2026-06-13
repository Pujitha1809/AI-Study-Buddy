/**
 * Splits text into chunks with overlap.
 * @param {string} text
 * @param {number} chunkSize
 * @param {number} overlapSize
 * @returns {string[]}
 */
function splitText(text, chunkSize = 500, overlapSize = 100) {
    if (!text) return [];
    
    const chunks = [];
    let i = 0;
    while (i < text.length) {
        let end = i + chunkSize;
        // Try to avoid breaking mid-word
        if (end < text.length) {
            let nextSpace = text.indexOf(' ', end);
            if (nextSpace !== -1 && nextSpace - end < 50) {
                end = nextSpace;
            }
        }
        
        chunks.push(text.substring(i, end));
        
        if (end >= text.length) break;
        
        i = end - overlapSize;
    }
    
    return chunks;
}

module.exports = { splitText };
