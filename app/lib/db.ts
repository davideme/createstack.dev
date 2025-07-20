/**
 * IndexedDB wrapper for CreateStack project management
 * Provides type-safe, async database operations
 */

export interface Project {
  id: string;
  name: string;
  platform: string;
  projectType: string;
  architecture?: string;
  cloudPlatform?: string;
  dependencyTool: string;
  documentationTool: string;
  cicdTool: string;
  issueTrackingTool?: string;
  featureFlagTool?: string;
  teamPersonas?: string[]; // Array of persona IDs
  industry?: string; // Industry selection
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

  private convertDates(project: any): Project {
    return {
      ...project,
      createdAt: new Date(project.createdAt),
      lastModified: new Date(project.lastModified)
    };
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
        // Note: lastSaved should only be updated in user-initiated saves
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
          const project = this.convertDates(result);
          resolve(project);
        } else {
          resolve(null);
        }
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
        const results = request.result.map((project: any) => this.convertDates(project));
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
        const results = request.result.map((project: any) => this.convertDates(project));
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
    projectType: string;
    architecture?: string;
    cloudPlatform?: string;
    dependencyTool: string;
    documentationTool: string;
    cicdTool: string;
    issueTrackingTool?: string;
    featureFlagTool?: string;
    teamPersonas?: string[];
    industry?: string;
  }): Promise<Project> {
    const currentProject = await this.getCurrentProject();
    
    if (currentProject) {
      // Update existing project
      const updatedProject: Project = {
        ...currentProject,
        name: projectData.name,
        platform: projectData.platform,
        projectType: projectData.projectType,
        architecture: projectData.architecture,
        cloudPlatform: projectData.cloudPlatform,
        dependencyTool: projectData.dependencyTool,
        documentationTool: projectData.documentationTool,
        cicdTool: projectData.cicdTool,
        issueTrackingTool: projectData.issueTrackingTool,
        featureFlagTool: projectData.featureFlagTool,
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
        projectType: projectData.projectType,
        architecture: projectData.architecture,
        cloudPlatform: projectData.cloudPlatform,
        dependencyTool: projectData.dependencyTool,
        documentationTool: projectData.documentationTool,
        cicdTool: projectData.cicdTool,
        issueTrackingTool: projectData.issueTrackingTool,
        featureFlagTool: projectData.featureFlagTool,
        teamPersonas: projectData.teamPersonas,
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
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.projects || !Array.isArray(data.projects)) {
        throw new Error('Invalid data format: projects array is required');
      }
      
      // Import projects
      for (const project of data.projects) {
        // Ensure required fields exist
        if (!project.id || !project.name || !project.platform) {
          console.warn('Skipping invalid project:', project);
          continue;
        }
        
        await this.saveProject({
          ...project,
          createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
          lastModified: project.lastModified ? new Date(project.lastModified) : new Date()
        });
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    projectType: string;
    architecture?: string;
    cloudPlatform?: string;
    dependencyTool: string;
    documentationTool: string;
    cicdTool: string;
    issueTrackingTool?: string;
    featureFlagTool?: string;
    teamPersonas?: string[];
    industry?: string;
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
