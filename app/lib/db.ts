/**
 * IndexedDB wrapper for CreateStack project management
 * Provides type-safe, async database operations with automatic migrations
 */

export interface Project {
  id: string;
  name: string;
  platform: string;
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'archived' | 'draft';
  repositoryUrl?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ProjectConfig {
  id: string;
  projectId: string;
  type: 'terraform' | 'pulumi' | 'cdk' | 'cloudformation';
  content: string;
  createdAt: Date;
  lastModified: Date;
}

export interface VendorEvaluation {
  id: string;
  projectId: string;
  vendorName: string;
  evaluationData: Record<string, any>;
  createdAt: Date;
  lastModified: Date;
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
        
        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('name', 'name', { unique: false });
          projectStore.createIndex('platform', 'platform', { unique: false });
          projectStore.createIndex('status', 'status', { unique: false });
          projectStore.createIndex('lastModified', 'lastModified', { unique: false });
        }

        // Project configurations store
        if (!db.objectStoreNames.contains('configs')) {
          const configStore = db.createObjectStore('configs', { keyPath: 'id' });
          configStore.createIndex('projectId', 'projectId', { unique: false });
          configStore.createIndex('type', 'type', { unique: false });
        }

        // Vendor evaluations store
        if (!db.objectStoreNames.contains('vendors')) {
          const vendorStore = db.createObjectStore('vendors', { keyPath: 'id' });
          vendorStore.createIndex('projectId', 'projectId', { unique: false });
          vendorStore.createIndex('vendorName', 'vendorName', { unique: false });
        }

        // User preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          const prefStore = db.createObjectStore('preferences', { keyPath: 'key' });
        }
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
          lastModified: new Date(project.lastModified)
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
          lastModified: new Date(project.lastModified)
        }));
        resolve(results);
      };
    });
  }

  async deleteProject(id: string): Promise<void> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['projects', 'configs', 'vendors'], 'readwrite');
      
      // Delete project
      const projectStore = transaction.objectStore('projects');
      projectStore.delete(id);
      
      // Delete related configs
      const configStore = transaction.objectStore('configs');
      const configIndex = configStore.index('projectId');
      const configRequest = configIndex.openCursor(id);
      configRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      
      // Delete related vendor evaluations
      const vendorStore = transaction.objectStore('vendors');
      const vendorIndex = vendorStore.index('projectId');
      const vendorRequest = vendorIndex.openCursor(id);
      vendorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  // Configuration operations
  async saveConfig(config: ProjectConfig): Promise<void> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['configs'], 'readwrite');
      const store = transaction.objectStore('configs');
      
      const request = store.put({
        ...config,
        lastModified: new Date()
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getConfigsByProject(projectId: string): Promise<ProjectConfig[]> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['configs'], 'readonly');
      const store = transaction.objectStore('configs');
      const index = store.index('projectId');
      const request = index.getAll(projectId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const results = request.result.map((config: any) => ({
          ...config,
          createdAt: new Date(config.createdAt),
          lastModified: new Date(config.lastModified)
        }));
        resolve(results);
      };
    });
  }

  // Preference operations
  async setPreference(key: string, value: any): Promise<void> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readwrite');
      const store = transaction.objectStore('preferences');
      
      const request = store.put({ key, value, lastModified: new Date() });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getPreference(key: string): Promise<any> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readonly');
      const store = transaction.objectStore('preferences');
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
    });
  }

  // Migration from localStorage
  async migrateFromLocalStorage(): Promise<void> {
    const localStorageProjects = localStorage.getItem('createstack-projects');
    const projectName = localStorage.getItem('createstack-project-name');
    const selectedPlatform = localStorage.getItem('createstack-selected-platform');
    
    if (localStorageProjects) {
      try {
        const projects = JSON.parse(localStorageProjects);
        for (const project of projects) {
          await this.saveProject({
            ...project,
            createdAt: new Date(project.createdAt),
            lastModified: new Date(project.lastModified)
          });
        }
        console.log(`Migrated ${projects.length} projects from localStorage`);
      } catch (error) {
        console.error('Failed to migrate projects from localStorage:', error);
      }
    }

    if (projectName) {
      await this.setPreference('currentProjectName', projectName);
    }

    if (selectedPlatform) {
      await this.setPreference('selectedPlatform', selectedPlatform);
    }
  }

  // Export/Import for backup
  async exportData(): Promise<string> {
    const [projects, preferences] = await Promise.all([
      this.getAllProjects(),
      this.getAllPreferences()
    ]);

    return JSON.stringify({
      version: this.version,
      timestamp: new Date().toISOString(),
      projects,
      preferences
    }, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    
    // Import projects
    for (const project of data.projects || []) {
      await this.saveProject(project);
    }

    // Import preferences
    for (const [key, value] of Object.entries(data.preferences || {})) {
      await this.setPreference(key, value);
    }
  }

  private async getAllPreferences(): Promise<Record<string, any>> {
    this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readonly');
      const store = transaction.objectStore('preferences');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result: Record<string, any> = {};
        request.result.forEach((item: any) => {
          result[item.key] = item.value;
        });
        resolve(result);
      };
    });
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
        // Auto-migrate from localStorage on first load
        return db.migrateFromLocalStorage();
      })
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
