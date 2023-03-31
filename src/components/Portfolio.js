import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import db from '../services/firebase';

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projects);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'projects'), {
      title,
      description,
      url,
      visible,
    });
    setTitle('');
    setDescription('');
    setUrl('');
    setVisible(true);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  const handleVisibility = async (id, visible) => {
    await updateDoc(doc(db, 'projects', id), { visible });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        <br />
        <label>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <br />
        <label>
          Visible:
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Add Project</button>
      </form>
      <hr />
      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          {project.url && (
            <p>
              <a href={project.url} target="_blank" rel="noreferrer">
                {project.url}
              </a>
            </p>
          )}
          <button onClick={() => handleDelete(project.id)}>Delete</button>
          <button
            onClick={() =>
              handleVisibility(project.id, !project.visible)
            }
          >
            {project.visible ? 'Hide' : 'Show'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Portfolio;
