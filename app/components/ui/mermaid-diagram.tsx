import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  id: string;
  diagram: string;
  className?: string;
}

let mermaidInitialized = false;

export function MermaidDiagram({ id, diagram, className = "" }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeMermaid = async () => {
      if (!isMounted) return;

      try {
        setIsLoading(true);
        setError(null);

        // Initialize mermaid only once globally
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            themeVariables: {
              primaryColor: "#3b82f6",
              primaryTextColor: "#1f2937",
              primaryBorderColor: "#6b7280",
              lineColor: "#6b7280",
              secondaryColor: "#f3f4f6",
              tertiaryColor: "#ffffff",
            },
            architecture: {
              useMaxWidth: true,
            },
          });
          mermaidInitialized = true;
        }

        // Create a unique ID for this diagram
        const diagramId = `mermaid-${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render the diagram using mermaid.render
        const { svg } = await mermaid.render(diagramId, diagram);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setSvgContent(svg);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error rendering mermaid diagram:", error);
        
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Unknown error");
          setIsLoading(false);
          setSvgContent("");
        }
      }
    };

    // Add a small delay to ensure DOM is ready
    timeoutId = setTimeout(initializeMermaid, 100);
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id, diagram]);

  if (isLoading) {
    return (
      <div
        id={id}
        className={`w-full overflow-x-auto ${className}`}
        style={{ minHeight: "200px" }}
      >
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">Loading diagram...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        id={id}
        className={`w-full overflow-x-auto ${className}`}
        style={{ minHeight: "200px" }}
      >
        <div className="text-red-500 p-4 border border-red-200 rounded">
          <p className="font-medium">Error rendering diagram:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      ref={elementRef}
      className={`w-full overflow-x-auto ${className}`}
      style={{ minHeight: "200px" }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
