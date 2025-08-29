import { RecursiveCharacterTextSplitter, CharacterTextSplitter, TokenTextSplitter, MarkdownTextSplitter } from "langchain/text_splitter";

/**
 * Chunker class providing various text chunking strategies using LangChain.js
 */
export class Chunker {
  constructor(options = {}) {
    this.defaultChunkSize = options.chunkSize || 1000;
    this.defaultChunkOverlap = options.chunkOverlap || 200;
    this.defaultSeparators = options.separators || ["\n\n", "\n", " ", ""];
  }

  /**
   * Recursive character-based chunking (recommended for most use cases)
   * @param {string} text - Text to chunk
   * @param {Object} options - Chunking options
   * @returns {Promise<Array<string>>} Array of text chunks
   */
  async recursiveCharacterChunk(text, options = {}) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: options.chunkSize || this.defaultChunkSize,
      chunkOverlap: options.chunkOverlap || this.defaultChunkOverlap,
      separators: options.separators || this.defaultSeparators,
    });

    return await splitter.splitText(text);
  }

  /**
   * Simple character-based chunking
   * @param {string} text - Text to chunk
   * @param {Object} options - Chunking options
   * @returns {Promise<Array<string>>} Array of text chunks
   */
  async characterChunk(text, options = {}) {
    const splitter = new CharacterTextSplitter({
      chunkSize: options.chunkSize || this.defaultChunkSize,
      chunkOverlap: options.chunkOverlap || this.defaultChunkOverlap,
      separator: options.separator || "\n",
    });

    return await splitter.splitText(text);
  }

  /**
   * Token-based chunking (useful for LLM token limits)
   * @param {string} text - Text to chunk
   * @param {Object} options - Chunking options
   * @returns {Promise<Array<string>>} Array of text chunks
   */
  async tokenChunk(text, options = {}) {
    const splitter = new TokenTextSplitter({
      chunkSize: options.chunkSize || 100,
      chunkOverlap: options.chunkOverlap || 20,
      encodingName: options.encodingName || "cl100k_base", // OpenAI's encoding
    });

    return await splitter.splitText(text);
  }

  /**
   * Markdown-aware chunking
   * @param {string} text - Markdown text to chunk
   * @param {Object} options - Chunking options
   * @returns {Promise<Array<string>>} Array of text chunks
   */
  async markdownChunk(text, options = {}) {
    const splitter = new MarkdownTextSplitter({
      chunkSize: options.chunkSize || this.defaultChunkSize,
      chunkOverlap: options.chunkOverlap || this.defaultChunkOverlap,
    });

    return await splitter.splitText(text);
  }


  /**
   * Semantic chunking based on content meaning
   * @param {string} text - Text to chunk
   * @param {Object} options - Chunking options
   * @returns {Promise<Array<string>>} Array of text chunks
   */
  async semanticChunk(text, options = {}) {
    // Split by paragraphs first, then by sentences
    const paragraphSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: options.chunkSize || this.defaultChunkSize,
      chunkOverlap: options.chunkOverlap || this.defaultChunkOverlap,
      separators: ["\n\n", "\n", ". ", "! ", "? ", " ", ""],
    });

    return await paragraphSplitter.splitText(text);
  }

  /**
   * Chunk by specific delimiter
   * @param {string} text - Text to chunk
   * @param {string} delimiter - Delimiter to split on
   * @param {Object} options - Chunking options
   * @returns {Promise<Array<string>>} Array of text chunks
   */
  async delimiterChunk(text, delimiter, options = {}) {
    const splitter = new CharacterTextSplitter({
      chunkSize: options.chunkSize || this.defaultChunkSize,
      chunkOverlap: options.chunkOverlap || this.defaultChunkOverlap,
      separator: delimiter,
    });

    return await splitter.splitText(text);
  }

  /**
   * Chunk text into equal-sized chunks
   * @param {string} text - Text to chunk
   * @param {number} chunkSize - Size of each chunk
   * @param {number} overlap - Overlap between chunks
   * @returns {Array<string>} Array of text chunks
   */
  equalSizeChunk(text, chunkSize, overlap = 0) {
    const chunks = [];
    let start = 0;
    
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start = end - overlap;
      
      if (start >= text.length) break;
    }
    
    return chunks;
  }

  /**
   * Chunk text by sentences
   * @param {string} text - Text to chunk
   * @param {Object} options - Chunking options
   * @returns {Array<string>} Array of sentence chunks
   */
  sentenceChunk(text, options = {}) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = "";
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= (options.chunkSize || this.defaultChunkSize)) {
        currentChunk += (currentChunk ? " " : "") + sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }

  /**
   * Get chunk statistics
   * @param {Array<string>} chunks - Array of text chunks
   * @returns {Object} Statistics about the chunks
   */
  getChunkStats(chunks) {
    const lengths = chunks.map(chunk => chunk.length);
    const totalLength = lengths.reduce((sum, len) => sum + len, 0);
    
    return {
      totalChunks: chunks.length,
      totalCharacters: totalLength,
      averageChunkSize: Math.round(totalLength / chunks.length),
      minChunkSize: Math.min(...lengths),
      maxChunkSize: Math.max(...lengths),
      chunkSizes: lengths
    };
  }

  /**
   * Validate chunk sizes
   * @param {Array<string>} chunks - Array of text chunks
   * @param {number} maxSize - Maximum allowed chunk size
   * @returns {Object} Validation results
   */
  validateChunks(chunks, maxSize) {
    const oversizedChunks = chunks.filter(chunk => chunk.length > maxSize);
    const validChunks = chunks.filter(chunk => chunk.length <= maxSize);
    
    return {
      isValid: oversizedChunks.length === 0,
      totalChunks: chunks.length,
      validChunks: validChunks.length,
      oversizedChunks: oversizedChunks.length,
      oversizedIndices: chunks
        .map((chunk, index) => chunk.length > maxSize ? index : -1)
        .filter(index => index !== -1)
    };
  }
}

// Export default instance with common settings
export const defaultChunker = new Chunker({
  chunkSize: 1000,
  chunkOverlap: 200
});
