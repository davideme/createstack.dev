/**
 * IndexedDB wrapper for CreateStack project management
 * Provides type-safe, async database operations
 */

export interface Project {
  id: string;
  name: string;
  platform: string;
  dependencyTool: string;
  documentationTool: string;
  lastSaved: Date;
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'archived' | 'draft';
  repositoryUrl?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

class CreateStackDB {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'createstack-db';
  private readonly version = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create projects store
        const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
        
        // Add indexes
        projectStore.createIndex('name', 'name', { unique: false });
        projectStore.createIndex('platform', 'platform', { unique: false });
        projectStore.createIndex('dependencyTool', 'dependencyTool', { unique: false });
        projectStore.createIndex('documentationTool', 'documentationTool', { unique: false });
        projectStore.createIndex('status', 'status', { unique: false });
        projectStore.createIndex('lastModified', 'lastModified', { unique: false });
      };
    });
  }

  private ensureConnection(): void {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
  }

  // Project operations
  async saveProject(project: Project): Promise<void> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      
      const request = store.put({
        ...project,
        lastModified: new Date()
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getProject(id: string): Promise<Project | null> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Convert date strings back to Date objects
          result.createdAt = new Date(result.createdAt);
          result.lastModified = new Date(result.lastModified);
          result.lastSaved = new Date(result.lastSaved);
        }
        resolve(result || null);
      };
    });
  }

  async getAllProjects(): Promise<Project[]> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const results = request.result.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          lastModified: new Date(project.lastModified),
          lastSaved: new Date(project.lastSaved)
        }));
        resolve(results);
      };
    });
  }

  async getProjectsByStatus(status: Project['status']): Promise<Project[]> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const index = store.index('status');
      const request = index.getAll(status);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const results = request.result.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          lastModified: new Date(project.lastModified),
          lastSaved: new Date(project.lastSaved)
        }));
        resolve(results);
      };
    });
  }

  async deleteProject(id: string): Promise<void> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects'], 'readwrite');
      
      // Delete project
      const projectStore = transaction.objectStore('projects');
      projectStore.delete(id);

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  // Current working project operations
  async getCurrentProject(): Promise<Project | null> {
    if (typeof window === 'undefined') return null;
    
    const currentProjectId = localStorage.getItem('createstack-currentProjectId');
    if (!currentProjectId) return null;
    
    return await this.getProject(currentProjectId);
  }

  async setCurrentProject(projectId: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('createstack-currentProjectId', projectId);
    }
  }

  async clearCurrentProject(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('createstack-currentProjectId');
    }
  }

  async saveCurrentProject(projectData: {
    name: string;
    platform: string;
    dependencyTool: string;
    documentationTool: string;
  }): Promise<Project> {
    const currentProject = await this.getCurrentProject();
    
    if (currentProject) {
      // Update existing project
      const updatedProject: Project = {
        ...currentProject,
        name: projectData.name,
        platform: projectData.platform,
        dependencyTool: projectData.dependencyTool,
        documentationTool: projectData.documentationTool,
        lastSaved: new Date(),
        lastModified: new Date()
      };
      await this.saveProject(updatedProject);
      return updatedProject;
    } else {
      // Create new project
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: projectData.name,
        platform: projectData.platform,
        dependencyTool: projectData.dependencyTool,
        documentationTool: projectData.documentationTool,
        lastSaved: new Date(),
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft'
      };
      await this.saveProject(newProject);
      await this.setCurrentProject(newProject.id);
      return newProject;
    }
  }

  // Export/Import for backup
  async exportData(): Promise<string> {
    const projects = await this.getAllProjects();

    return JSON.stringify({
      version: this.version,
      timestamp: new Date().toISOString(),
      projects
    }, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    
    // Import projects
    for (const project of data.projects || []) {
      await this.saveProject(project);
    }
  }
}

// Singleton instance
export const db = new CreateStackDB();

// React hook for database operations
import { useEffect, useState } from 'react';

export function useDB() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.init()
      .then(() => {
        setIsReady(true);
      })
      .catch((err) => {
        setError(err.message);
        console.error('Database initialization failed:', err);
      });
  }, []);

  return { db, isReady, error };
}

// React hook for projects
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { isReady } = useDB();

  const refreshProjects = async () => {
    if (!isReady) return;
    
    try {
      const allProjects = await db.getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      refreshProjects();
    }
  }, [isReady]);

  const saveProject = async (project: Project) => {
    await db.saveProject(project);
    await refreshProjects();
  };

  const deleteProject = async (id: string) => {
    await db.deleteProject(id);
    await refreshProjects();
  };

  return {
    projects,
    loading,
    saveProject,
    deleteProject,
    refreshProjects
  };
}

// React hook for current working project
export function useCurrentProject() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { isReady } = useDB();

  const loadCurrentProject = async () => {
    if (!isReady) return;
    
    try {
      const project = await db.getCurrentProject();
      setCurrentProject(project);
    } catch (error) {
      console.error('Failed to load current project:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      loadCurrentProject();
    }
  }, [isReady]);

  const saveCurrentProject = async (projectData: {
    name: string;
    platform: string;
    dependencyTool: string;
    documentationTool: string;
  }) => {
    const project = await db.saveCurrentProject(projectData);
    setCurrentProject(project);
    return project;
  };

  const clearCurrentProject = async () => {
    await db.clearCurrentProject();
    setCurrentProject(null);
  };

  return {
    currentProject,
    loading,
    saveCurrentProject,
    clearCurrentProject,
    refreshCurrentProject: loadCurrentProject
  };
}
