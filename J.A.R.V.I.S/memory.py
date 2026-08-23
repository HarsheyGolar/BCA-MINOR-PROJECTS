# import chromadb

# class MemoryManager:
#     def init(self, storage_path: str = "/.chroma_db"):
#         self.client = chromadb.PersistentClient(path=storage_path)
#         self.collection = self.client.get_or_create_collection(name = "jarvis_memory")

#     def store_memory(self, user_id: str, text: str, metadata: dict = None):
#         doc_id = f"{user_id}_{self.collection.count()}"
#         self.collection.add(
#             documents = [text],
#             metadata=[metadata or {"user-id": user_id}],
#             ids=[doc_id]
#         )

#     def recall_memory(self, user_id: str, query: str, n_results: int = 2) -> list[str]:
#         results = self.collection.query(
#             query_texts=[query],
#             n_results=n_results,
#             where = {"user_id": user_id}
#         )
#         return results.get("documents",[[]])[0]

import chromadb

class MemoryManager:
    def __init__(self, storage_path: str = "./chroma_db"):
        # Double underscores on __init__ are mandatory
        self.client = chromadb.PersistentClient(path=storage_path)
        self.collection = self.client.get_or_create_collection(name="jarvis_memory")

    def store_memory(self, user_id: str, text: str, metadata: dict = None):
        doc_id = f"{user_id}_{self.collection.count() + 1}"
        self.collection.add(
            documents=[text],
            metadatas=[metadata or {"user_id": user_id}],
            ids=[doc_id]
        )

    def recall_memory(self, user_id: str, query: str, n_results: int = 2) -> list[str]:
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where={"user_id": user_id}
        )
        return results.get("documents", [[]])[0]