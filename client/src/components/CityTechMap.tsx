import { useEffect, useRef, useState } from "react";
import { Issue } from "@/contexts/IssuesContext";
import { Card } from "@/components/ui/card";
import { X, AlertTriangle, AlertCircle, Leaf } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CityTechMapProps {
  issues: Issue[];
  onClusterClick?: (issues: Issue[]) => void;
  selectedCluster?: Issue[] | null;
  onClusterClose?: () => void;
}

const ALMATY_CENTER = [43.2381, 76.9453] as [number, number];
const CATEGORY_CONFIG = {
  critical: { color: "#EF4444", icon: AlertTriangle },
  warning: { color: "#F59E0B", icon: AlertCircle },
  community: { color: "#22C55E", icon: Leaf },
};

export default function CityTechMap({ issues, onClusterClick, selectedCluster, onClusterClose }: CityTechMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const clustersRef = useRef<Map<string, Issue[]>>(new Map());

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(ALMATY_CENTER, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    clustersRef.current.clear();

    // Create clusters (group issues by proximity)
    const clusters = createClusters(issues, 0.05); // ~5km clusters

    // Add cluster markers
    clusters.forEach((clusterIssues, clusterKey) => {
      const [lat, lng] = clusterKey.split(",").map(Number);
      const criticalCount = clusterIssues.filter((i) => i.category === "critical").length;
      const warningCount = clusterIssues.filter((i) => i.category === "warning").length;
      const communityCount = clusterIssues.filter((i) => i.category === "community").length;

      // Determine cluster color based on highest severity
      let clusterColor = "#22C55E"; // green
      if (criticalCount > 0) clusterColor = "#EF4444"; // red
      else if (warningCount > 0) clusterColor = "#F59E0B"; // amber

      // Create cluster marker
      const html = `
        <div class="flex items-center justify-center w-12 h-12 rounded-full font-bold text-white text-sm shadow-lg"
             style="background-color: ${clusterColor}; border: 3px solid white;">
          ${clusterIssues.length}
        </div>
      `;

      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          html,
          iconSize: [48, 48],
          className: "cluster-marker",
        }),
      }).addTo(map.current!);

      marker.on("click", () => {
        onClusterClick?.(clusterIssues);
      });

      markersRef.current.push(marker);
      clustersRef.current.set(clusterKey, clusterIssues);
    });
  }, [issues, onClusterClick]);

  const createClusters = (issues: Issue[], gridSize: number): Map<string, Issue[]> => {
    const clusters = new Map<string, Issue[]>();

    issues.forEach((issue) => {
      const gridLat = Math.round(issue.location.lat / gridSize) * gridSize;
      const gridLng = Math.round(issue.location.lng / gridSize) * gridSize;
      const key = `${gridLat},${gridLng}`;

      if (!clusters.has(key)) {
        clusters.set(key, []);
      }
      clusters.get(key)!.push(issue);
    });

    return clusters;
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />

      {/* Side Panel for Selected Cluster */}
      {selectedCluster && selectedCluster.length > 0 && (
        <div className="absolute top-4 right-4 w-80 max-h-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-bold text-slate-900">Проблемы в районе ({selectedCluster.length})</h3>
            <button
              onClick={onClusterClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 space-y-2 p-3">
            {selectedCluster.map((issue) => {
              const config = CATEGORY_CONFIG[issue.category];
              const Icon = config.icon;
              return (
                <div
                  key={issue.id}
                  className="p-3 border-l-4 rounded bg-slate-50 hover:bg-slate-100 transition-colors"
                  style={{ borderLeftColor: config.color }}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: config.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 line-clamp-2">{issue.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{issue.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {issue.supportCount} голосов
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
