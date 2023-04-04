import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../services/firebase";
import "../styles/Portfolio.css";

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(true);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [projectId, setProjectId] = useState("");

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

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      // Fetch the current project data from Firestore
      const projectDoc = await getDoc(doc(db, "projects", projectId));
      const projectData = projectDoc.data();

      // Update only the fields that have changed
      const updates = {};
      if (title !== projectData.title) {
        updates.title = title;
      }
      if (description !== projectData.description) {
        updates.description = description;
      }
      if (url !== projectData.url) {
        updates.url = url;
      }
      if (visible !== projectData.visible) {
        updates.visible = visible;
      }

      // Update project in Firestore
      await updateDoc(doc(db, "projects", projectId), updates);

      // If a new image was uploaded, add it to storage
      if (image) {
        const storageRef = ref(storage, `${projectId}/${image.name}`);
        await uploadBytes(storageRef, image);
        const newImageUrl = await getDownloadURL(storageRef);

        // Delete old image if it exists
        if (imageUrl) {
          const oldImageRef = ref(storage, imageUrl);
          await deleteObject(oldImageRef);
        }

        // Update project with new image URL
        await updateDoc(doc(db, "projects", projectId), {
          imageUrl: newImageUrl,
        });

        setImageUrl(newImageUrl);
      }

      // Reset form state
      setTitle("");
      setDescription("");
      setUrl("");
      setVisible(true);
      setImage(null);
      setUploadError(null);

      // Close the editing modal
      setEditing(false);
    } catch (error) {
      console.error(error);
      setUploadError(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
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

  return (
    <div className="container">
      <div className="row">
        {!editing && (
          <div className="col-md-4">
            <form className="submit-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={10}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="url">URL:</label>
                <input
                  type="text"
                  className="form-control"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Image:</label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  onChange={handleFileChange}
                />
              </div>
              <div className="form-group">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="visible"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="visible">
                    Visible
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary submit-btn">
                Add Project
              </button>
            </form>
          </div>
        )}
        {editing && (
          <div className="col-md-4">
            <form className="edit-form" onSubmit={handleEdit}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={10}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="url">URL:</label>
                <input
                  type="text"
                  className="form-control"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Image:</label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="visible"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="visible">
                    Visible
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary update-btn">
                Update Project
              </button>
              <button
                type="button"
                className="btn btn-secondary cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
        <div className="col-md-8">
          <div className="row card-columns">
            {projects.map((project) => (
              <div key={project.id} className="col-md-4">
                <div className="card">
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      className="card-img-top"
                      alt={project.title}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{project.title}</h5>
                    <p className="card-text">{project.description}</p>
                    <div className="card-controls">
                      {project.url && (
                        <a
                          href={project.url}
                          className="btn btn-primary visit-btn"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Visit Website
                        </a>
                      )}
                      <button
                        className="btn btn-danger delete-btn"
                        onClick={() =>
                          handleDelete(project.id, project.imageUrl)
                        }
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-warning visibility-btn"
                        onClick={() =>
                          handleVisibility(project.id, !project.visible)
                        }
                      >
                        {project.visible ? "Hide" : "Show"}
                      </button>
                      <button
                        className="btn btn-danger edit-btn"
                        onClick={() => {
                          setEditing(true);
                          setProjectId(project.id);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Portfolio;
