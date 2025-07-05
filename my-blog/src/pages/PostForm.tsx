import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  addDoc, collection, doc, getDoc, serverTimestamp, updateDoc
} from "firebase/firestore";

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      getDoc(doc(db, "posts", id)).then(docSnap => {
        const data = docSnap.data();
        if (data) {
          setTitle(data.title);
          setDescription(data.description);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateDoc(doc(db, "posts", id), { title, description });
    } else {
      await addDoc(collection(db, "posts"), {
        title,
        description,
        createdAt: serverTimestamp()
      });
    }
    navigate("/");
  };

  return (
    <div className="card shadow-sm p-4">
      <h2 className="mb-3">{id ? "Edit Post" : "Add New Post"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={5}
            required
          />
        </div>
        <button className="btn btn-success" type="submit">Save</button>
      </form>
    </div>
  );
}