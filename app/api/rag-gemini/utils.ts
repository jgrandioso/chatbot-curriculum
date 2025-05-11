import { google } from "@ai-sdk/google"
import { cosineSimilarity } from "ai"

export type Document = {
  content: string
  embedding?: number[]
}

export type RetrievedDocument = {
  content: string
  similarity: number
}

// Helper function to create embeddings for documents
export async function createEmbeddings(documents: string[]) {
  const embeddingModel = google.textEmbeddingModel("embedding-001")

  const embeddings = await Promise.all(
    documents.map(async (doc) => {
      const response = await embeddingModel.embed(doc)
      return response.embedding
    }),
  )

  return documents.map((content, i) => ({
    content,
    embedding: embeddings[i],
  }))
}

// Helper function to retrieve relevant documents
export async function retrieveRelevantDocuments(query: string, documents: Document[], topK = 3, threshold = 0.75) {
  const embeddingModel = google.textEmbeddingModel("embedding-001")
  const queryEmbedding = await embeddingModel.embed(query)

  const docsWithSimilarity = documents
    .filter((doc) => doc.embedding)
    .map((doc) => ({
      content: doc.content,
      similarity: cosineSimilarity(queryEmbedding.embedding, doc.embedding!),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)

  return {
    documents: docsWithSimilarity,
    hasRelevantDocs: docsWithSimilarity.length > 0 && docsWithSimilarity[0].similarity >= threshold,
  }
}
