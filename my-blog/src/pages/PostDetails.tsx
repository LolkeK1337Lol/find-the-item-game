import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useEffect, useState } from "react";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getDoc(doc(db, "posts", id)).then(snapshot => {
        if (snapshot.exists()) {
          setPost(snapshot.data());
        }
      });
    }
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="card shadow-sm p-4">
      <h2>{post.title}</h2>
      <p className="text-muted">
        Created at: {post.createdAt?.toDate?.().toLocaleString?.()}
      </p>
      <p>{post.description}</p>
    </div>
  );
}
