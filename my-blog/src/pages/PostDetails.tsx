import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import Spinner from "../components/Spinner";

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Пост не найден");
          navigate("/");
        }
      } catch (error) {
        console.error("Ошибка загрузки поста:", error);
        alert("Ошибка загрузки поста");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) return <Spinner />;

  if (!post) return null;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p className="text-muted">
          {post.createdAt?.toDate?.().toLocaleString?.() || "Дата неизвестна"}
        </p>
        <p>{post.description}</p>
      </div>
    </div>
  );
};

export default PostDetails;
