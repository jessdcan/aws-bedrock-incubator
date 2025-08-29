import { Chunker, defaultChunker } from './chunker.js';

// Example usage of the Chunker class
async function demonstrateChunking() {
  console.log('=== Chunker Class Demonstration ===\n');

  // Sample text for chunking
  const sampleText = `This is a sample text document that we will use to demonstrate various chunking strategies. 
  
  It contains multiple paragraphs with different types of content. Some paragraphs are longer than others, 
  which will help show how different chunking methods handle varying content lengths.
  
  We can also include some technical content like code snippets or structured data. The chunking algorithms 
  should preserve the semantic meaning while breaking the text into manageable pieces.
  
  This is particularly useful for processing large documents with AI models, where we need to stay within 
  token limits while maintaining context and readability.`;

  // Create a custom chunker instance
  const customChunker = new Chunker({
    chunkSize: 150,
    chunkOverlap: 50
  });

  console.log('1. Recursive Character Chunking (Recommended):');
  const recursiveChunks = await customChunker.recursiveCharacterChunk(sampleText);
  console.log(`   Created ${recursiveChunks.length} chunks`);
  console.log('   First chunk:', recursiveChunks[0].substring(0, 100) + '...\n');

  console.log('2. Token-based Chunking:');
  const tokenChunks = await customChunker.tokenChunk(sampleText, { chunkSize: 50 });
  console.log(`   Created ${tokenChunks.length} chunks`);
  console.log('   First chunk:', tokenChunks[0].substring(0, 100) + '...\n');

  console.log('3. Sentence-based Chunking:');
  const sentenceChunks = customChunker.sentenceChunk(sampleText, { chunkSize: 200 });
  console.log(`   Created ${sentenceChunks.length} chunks`);
  console.log('   First chunk:', sentenceChunks[0].substring(0, 100) + '...\n');

  console.log('4. Equal-size Chunking:');
  const equalChunks = customChunker.equalSizeChunk(sampleText, 100, 20);
  console.log(`   Created ${equalChunks.length} chunks`);
  console.log('   First chunk:', equalChunks[0].substring(0, 100) + '...\n');

  console.log('5. Markdown-aware Chunking:');
  const markdownText = `# Title\n\n## Subtitle\n\nThis is **bold** text.\n\n- List item 1\n- List item 2\n\n\`\`\`javascript\nconsole.log("Hello World");\n\`\`\``;
  const markdownChunks = await customChunker.markdownChunk(markdownText, { chunkSize: 100 });
  console.log(`   Created ${markdownChunks.length} chunks`);
  console.log('   First chunk:', markdownChunks[0].substring(0, 100) + '...\n');

  // Get statistics
  console.log('6. Chunk Statistics:');
  const stats = customChunker.getChunkStats(recursiveChunks);
  console.log('   Stats:', JSON.stringify(stats, null, 2));

  // Validate chunks
  console.log('\n7. Chunk Validation:');
  const validation = customChunker.validateChunks(recursiveChunks, 200);
  console.log('   Validation:', JSON.stringify(validation, null, 2));

  // Using the default chunker
  console.log('\n8. Using Default Chunker:');
  const defaultChunks = await defaultChunker.recursiveCharacterChunk(sampleText);
  console.log(`   Created ${defaultChunks.length} chunks with default settings`);
}

// Run the demonstration
demonstrateChunking().catch(console.error);
