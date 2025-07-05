import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner"; // <== импорт спиннера

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // <== состояние загрузки
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postList);
      } catch (err) {
        console.error("Ошибка загрузки постов:", err);
      } finally {
        setLoading(false); // <== отключаем загрузку после запроса
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Spinner />; // <== пока загружается, показываем прелоадер

  return (
    <div className="row">
      {posts.map((post: any) => (
        <div key={post.id} className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text text-muted">
                {post.createdAt?.toDate?.().toLocaleString?.()}
              </p>
              <p className="card-text">{post.description.slice(0, 100)}...</p>
              <Link to={`/posts/${post.id}`} className="btn btn-primary me-2">Read more</Link>
              <button className="btn btn-outline-secondary" onClick={() => navigate(`/posts/${post.id}/edit`)}>Edit</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
