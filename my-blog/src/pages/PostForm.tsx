import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import Spinner from "../components/Spinner";

const PostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // для загрузки данных поста при редактировании

  useEffect(() => {
    if (!id) {
      setInitialLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
        } else {
          alert("Пост не найден");
          navigate("/");
        }
      } catch (error) {
        alert("Ошибка загрузки поста");
        navigate("/");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Заполните все поля");
      return;
    }

    setLoading(true);

    try {
      if (id) {
        // редактирование
        const docRef = doc(db, "posts", id);
        await updateDoc(docRef, {
          title,
          description,
          updatedAt: serverTimestamp(),
        });
      } else {
        // создание
        await addDoc(collection(db, "posts"), {
          title,
          description,
          createdAt: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      alert("Ошибка при сохранении");
      setLoading(false);
    }
  };

  if (initialLoading) return <Spinner />;

  return (
    <div className="card shadow-sm p-4">
      <h2>{id ? "Редактировать пост" : "Создать новый пост"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Заголовок</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Описание</label>
          <textarea
            className="form-control"
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Сохранение..." : id ? "Сохранить" : "Создать"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
