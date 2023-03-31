import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes,deleteObject } from "firebase/storage";
import { db, storage } from "../services/firebase";

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(true);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
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

    try {
      // Add project to Firestore
      const projectRef = await addDoc(collection(db, "projects"), {
        title,
        description,
        url,
        visible,
      });
      const projectId = projectRef.id;

      // Add image to storage with project title as file name
      const storageRef = ref(storage, `${title}`);
      await uploadBytes(storageRef, image);

      // Get download URL for image
      const imageUrl = await getDownloadURL(storageRef);

      // Update project with image URL
      await updateDoc(doc(db, "projects", projectId), {
        title,
        description,
        url,
        visible,
        imageUrl,
      });

      setTitle("");
      setDescription("");
      setUrl("");
      setVisible(true);
      setImage(null);
      setImageUrl("");
      setUploadError(null);
    } catch (error) {
      console.error(error);
      setUploadError(error.message);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    try {
      // Delete image from storage
      if (imageUrl) {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      }
    
      // Delete project from Firestore
      await deleteDoc(doc(db, "projects", id));
    } catch (error) {
      console.error(error);
      setUploadError(error.message);
    }
  };
  
  

  const handleVisibility = async (id, visible) => {
    try {
      await updateDoc(doc(db, "projects", id), { visible });
    } catch (error) {
      console.error(error);
      setUploadError(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
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
        <label>
          Image:
          <input type="file" onChange={handleFileChange} />
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
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt={project.title}
              style={{ maxWidth: "100%" }}
            />
          )}
          <button onClick={() => handleDelete(project.id, project.imageUrl)}>
            Delete
          </button>
          <button
            onClick={() => handleVisibility(project.id, !project.visible)}
          >
            {project.visible ? "Hide" : "Show"}
          </button>
        </div>
      ))}
    </div>
  );
}
export default Portfolio;
