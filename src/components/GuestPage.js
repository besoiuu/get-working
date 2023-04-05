import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../styles/GuestPage.css";

function GuestPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const projectsRef = collection(db, "projects");
    const visibleProjectsQuery = query(projectsRef, where("visible", "==", true))
    const snapshot = await getDocs(visibleProjectsQuery);
    const projectsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(projectsData);
  }

  return (
    <div className="projectsContainer">
      <h1 className="m-1 mt-2">Current projects our designers work on</h1>
      <div className="row">
        {projects.map((project) => (
          <div key={project.id} className="col-md-4">
            <div className="card m-4">
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
                <p className="card-text">Owner: {project.nickname}</p>
                {project.url && (
                  <a
                    href={project.url}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GuestPage;
