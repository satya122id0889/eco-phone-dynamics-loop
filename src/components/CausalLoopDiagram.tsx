import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Node types based on category
type NodeCategory = "material" | "user" | "economic" | "environmental" | "innovation";

// Define node structure
interface Node {
  id: string;
  label: string;
  category: NodeCategory;
  x: number;
  y: number;
  radius?: number;
}

// Define connection structure
interface Connection {
  source: string;
  target: string;
  relationship: "positive" | "negative";
  isPartOfLoop?: string[];
}

// Define loop structure
interface FeedbackLoop {
  id: string;
  name: string;
  type: "reinforcing" | "balancing";
  description: string;
  color: string;
  nodes: string[];
}

// Props for the component
interface CausalLoopDiagramProps {
  className?: string;
}

const CausalLoopDiagram: React.FC<CausalLoopDiagramProps> = ({ className }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState<string>("0 0 1200 1000");
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  // Colors for different node categories
  const categoryColors = {
    material: "#4CAF50",     // Green for material sourcing
    user: "#2196F3",         // Blue for user interaction
    economic: "#FFC107",     // Yellow/Gold for economic factors
    environmental: "#9C27B0", // Purple for environmental impact
    innovation: "#FF5722"    // Orange for innovation & design
  };

  // Colors for loops
  const loopColors = {
    R1: "#8BC34A", // Light green
    R2: "#03A9F4", // Light blue
    B1: "#FF9800", // Orange
    B2: "#E91E63"  // Pink
  };

  // Define nodes with adjusted positions to ensure visibility
  const nodes: Node[] = [
    // Material Sourcing - Positions adjusted to move lower
    { id: "rareEarthMining", label: "Rare Earth Mining", category: "material", x: 180, y: 200 },
    { id: "recycledMaterials", label: "Recycled Materials", category: "material", x: 100, y: 350 },
    { id: "ethicalSourcing", label: "Ethical Sourcing", category: "material", x: 240, y: 470 },
    { id: "bioDegradableMaterials", label: "Bio-based Materials", category: "material", x: 320, y: 270 },
    { id: "altBatteryChemistries", label: "Alternative Battery Chemistries", category: "material", x: 150, y: 550 },
    
    // User Interaction - Spread out more and moved to center
    { id: "repairability", label: "Repairability", category: "user", x: 480, y: 200 },
    { id: "deviceLongevity", label: "Device Longevity", category: "user", x: 400, y: 350 },
    { id: "newFeatureDemand", label: "Demand for New Features", category: "user", x: 580, y: 250 },
    { id: "digitalMinimalism", label: "Digital Minimalism", category: "user", x: 520, y: 470 },
    { id: "smartFeedback", label: "Smart Feedback Interfaces", category: "user", x: 680, y: 400 },
    { id: "oldPhoneRepurposing", label: "Old Phone Repurposing", category: "user", x: 600, y: 550 },
    
    // Economic Factors - Moved more to the right
    { id: "manufacturingCost", label: "Manufacturing Cost", category: "economic", x: 950, y: 220 },
    { id: "modularityBenefits", label: "Modularity Benefits", category: "economic", x: 850, y: 350 },
    { id: "upgradeSubsidies", label: "Carrier Upgrade Subsidies", category: "economic", x: 1050, y: 270 },
    { id: "refurbishmentEconomy", label: "Refurbishment Economy", category: "economic", x: 920, y: 420 },
    { id: "totalCostOfOwnership", label: "Total Cost of Ownership", category: "economic", x: 850, y: 550 },
    
    // Environmental Impact - More spaced out
    { id: "carbonEmissions", label: "Carbon Emissions", category: "environmental", x: 480, y: 650 },
    { id: "eWasteGeneration", label: "E-Waste Generation", category: "environmental", x: 350, y: 720 },
    { id: "recyclingRate", label: "Recycling Rate", category: "environmental", x: 580, y: 720 },
    { id: "energyUse", label: "Operational Energy Use", category: "environmental", x: 480, y: 800 },
    { id: "endOfLifeEfficiency", label: "End-of-Life Treatment Efficiency", category: "environmental", x: 680, y: 650 },
    
    // Innovation & Design - Better spacing
    { id: "aiDiagnostics", label: "Predictive AI Diagnostics", category: "innovation", x: 900, y: 650 },
    { id: "eInkInterfaces", label: "Smart E-ink Interfaces", category: "innovation", x: 780, y: 720 },
    { id: "bciAccessibility", label: "BCI for Accessibility", category: "innovation", x: 980, y: 720 },
    { id: "communityRepair", label: "Community Repair Networks", category: "innovation", x: 880, y: 800 },
    { id: "openSourceHardware", label: "Open-Source Hardware", category: "innovation", x: 780, y: 870 }
  ];

  // Define connections
  const connections: Connection[] = [
    // Material Connections
    { source: "rareEarthMining", target: "carbonEmissions", relationship: "positive" },
    { source: "recycledMaterials", target: "rareEarthMining", relationship: "negative", isPartOfLoop: ["B2"] },
    { source: "ethicalSourcing", target: "manufacturingCost", relationship: "positive" },
    { source: "bioDegradableMaterials", target: "endOfLifeEfficiency", relationship: "positive" },
    { source: "altBatteryChemistries", target: "deviceLongevity", relationship: "positive" },
    
    // User Interaction Connections
    { source: "repairability", target: "deviceLongevity", relationship: "positive", isPartOfLoop: ["B1"] },
    { source: "deviceLongevity", target: "eWasteGeneration", relationship: "negative", isPartOfLoop: ["B1", "R2"] },
    { source: "newFeatureDemand", target: "manufacturingCost", relationship: "positive", isPartOfLoop: ["R1"] },
    { source: "digitalMinimalism", target: "energyUse", relationship: "negative", isPartOfLoop: ["R2"] },
    { source: "smartFeedback", target: "energyUse", relationship: "negative" },
    { source: "oldPhoneRepurposing", target: "eWasteGeneration", relationship: "negative" },
    
    // Economic Connections
    { source: "manufacturingCost", target: "totalCostOfOwnership", relationship: "positive" },
    { source: "modularityBenefits", target: "repairability", relationship: "positive", isPartOfLoop: ["B1"] },
    { source: "upgradeSubsidies", target: "newFeatureDemand", relationship: "positive", isPartOfLoop: ["R1"] },
    { source: "refurbishmentEconomy", target: "recyclingRate", relationship: "positive" },
    { source: "totalCostOfOwnership", target: "newFeatureDemand", relationship: "negative" },
    
    // Environmental Connections
    { source: "carbonEmissions", target: "energyUse", relationship: "positive" },
    { source: "eWasteGeneration", target: "recyclingRate", relationship: "positive", isPartOfLoop: ["B2"] },
    { source: "recyclingRate", target: "recycledMaterials", relationship: "positive", isPartOfLoop: ["B2"] },
    { source: "energyUse", target: "deviceLongevity", relationship: "negative", isPartOfLoop: ["R2"] },
    { source: "endOfLifeEfficiency", target: "recyclingRate", relationship: "positive" },
    
    // Innovation Connections
    { source: "aiDiagnostics", target: "deviceLongevity", relationship: "positive" },
    { source: "eInkInterfaces", target: "energyUse", relationship: "negative" },
    { source: "bciAccessibility", target: "digitalMinimalism", relationship: "positive" },
    { source: "communityRepair", target: "repairability", relationship: "positive" },
    { source: "openSourceHardware", target: "modularityBenefits", relationship: "positive" },
    
    // Manufacturing frequency
    { source: "newFeatureDemand", target: "eWasteGeneration", relationship: "positive", isPartOfLoop: ["R1"] },
    { source: "eWasteGeneration", target: "recycledMaterials", relationship: "positive", isPartOfLoop: ["R1"] },
    
    // Additional needed connections for loops
    { source: "modularityBenefits", target: "eWasteGeneration", relationship: "negative", isPartOfLoop: ["B1"] },
  ];

  // Define feedback loops
  const feedbackLoops: FeedbackLoop[] = [
    {
      id: "R1",
      name: "Demand & Waste Loop",
      type: "reinforcing",
      description: "Demand for new features increases manufacturing frequency, leading to more e-waste, which increases recycling and use of recycled materials.",
      color: loopColors.R1,
      nodes: ["newFeatureDemand", "eWasteGeneration", "recycledMaterials"]
    },
    {
      id: "R2",
      name: "Smart Use Behavior Loop",
      type: "reinforcing",
      description: "Digital minimalism reduces energy use, which increases device longevity by reducing battery wear and e-waste.",
      color: loopColors.R2,
      nodes: ["digitalMinimalism", "energyUse", "deviceLongevity"]
    },
    {
      id: "B1",
      name: "Modularity Reduces Waste",
      type: "balancing",
      description: "Modularity increases repairability, extending device lifespan and reducing e-waste generation.",
      color: loopColors.B1,
      nodes: ["modularityBenefits", "repairability", "deviceLongevity", "eWasteGeneration"]
    },
    {
      id: "B2",
      name: "Recycling Stabilizer Loop",
      type: "balancing",
      description: "E-waste leads to increased recycling, which provides more recycled materials, reducing the need for new mining.",
      color: loopColors.B2,
      nodes: ["eWasteGeneration", "recyclingRate", "recycledMaterials", "rareEarthMining"]
    }
  ];

  // Update the viewBox when component mounts or window resizes
  useEffect(() => {
    const updateViewBox = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        // Increase viewBox to ensure all nodes are visible
        setViewBox(`0 0 ${Math.max(width, 1200)} ${Math.max(height, 1000)}`);
      }
    };
    
    updateViewBox();
    window.addEventListener('resize', updateViewBox);
    
    return () => {
      window.removeEventListener('resize', updateViewBox);
    };
  }, []);

  // Helper to get node by ID
  const getNodeById = (id: string): Node | undefined => {
    return nodes.find(node => node.id === id);
  };

  // Function to calculate path between two nodes
  const calculatePath = (sourceId: string, targetId: string): string => {
    const source = getNodeById(sourceId);
    const target = getNodeById(targetId);
    
    if (!source || !target) return "";
    
    // Calculate mid-point for arched path
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    
    // Add a slight curve
    const offset = 30;
    const controlX = midX;
    const controlY = midY - offset;
    
    return `M${source.x},${source.y} Q${controlX},${controlY} ${target.x},${target.y}`;
  };

  // Function to check if a node is part of the selected loop
  const isNodeInSelectedLoop = (nodeId: string): boolean => {
    if (!selectedLoop) return false;
    const loop = feedbackLoops.find(loop => loop.id === selectedLoop);
    return !!loop && loop.nodes.includes(nodeId);
  };
  
  // Function to check if a connection is part of the selected loop
  const isConnectionInSelectedLoop = (sourceId: string, targetId: string): boolean => {
    if (!selectedLoop) return false;
    const connection = connections.find(
      conn => conn.source === sourceId && conn.target === targetId && conn.isPartOfLoop?.includes(selectedLoop)
    );
    return !!connection;
  };

  return (
    <div className={cn("relative w-full h-[1100px] bg-card rounded-lg shadow-sm overflow-hidden transition-all duration-300", className)}>
      <div className="absolute top-4 left-4 z-10 p-4 bg-white bg-opacity-90 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-2">Causal Loop Diagram: Sustainable Smartphone Ecosystem</h2>
        <div className="flex flex-col space-y-1 mb-4">
          <p className="text-xs text-muted-foreground">Click on a loop to highlight its path</p>
          <div className="flex flex-wrap gap-2">
            {feedbackLoops.map((loop) => (
              <button
                key={loop.id}
                onClick={() => setSelectedLoop(selectedLoop === loop.id ? null : loop.id)}
                className={cn(
                  "px-2 py-1 text-xs rounded-full border font-medium",
                  selectedLoop === loop.id ? "text-white" : "text-foreground hover:text-white hover:bg-opacity-80"
                )}
                style={{ 
                  backgroundColor: selectedLoop === loop.id ? loop.color : 'transparent',
                  borderColor: loop.color 
                }}
              >
                {loop.id}: {loop.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryColors.material }}></div>
            <span className="text-xs">Material</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryColors.user }}></div>
            <span className="text-xs">User</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryColors.economic }}></div>
            <span className="text-xs">Economic</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryColors.environmental }}></div>
            <span className="text-xs">Environment</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: categoryColors.innovation }}></div>
            <span className="text-xs">Innovation</span>
          </div>
        </div>
      </div>
      
      {selectedLoop && (
        <div className="absolute top-4 right-4 z-10 p-4 bg-white bg-opacity-90 rounded-lg shadow-sm max-w-xs">
          <h3 className="text-sm font-bold" style={{ color: loopColors[selectedLoop as keyof typeof loopColors] }}>
            {selectedLoop}: {feedbackLoops.find(l => l.id === selectedLoop)?.name}
          </h3>
          <p className="text-xs mt-1">
            {feedbackLoops.find(l => l.id === selectedLoop)?.description}
          </p>
          <p className="text-xs mt-2 font-semibold">
            Type: {feedbackLoops.find(l => l.id === selectedLoop)?.type === "reinforcing" ? "Reinforcing (+)" : "Balancing (-)"}
          </p>
        </div>
      )}
      
      <svg 
        ref={svgRef} 
        viewBox={viewBox} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="arrowPositive"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#aaa" />
          </marker>
          <marker
            id="arrowNegative"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#aaa" />
          </marker>
          <marker
            id="arrowPositiveHighlighted"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={selectedLoop ? loopColors[selectedLoop as keyof typeof loopColors] : "#aaa"} />
          </marker>
          <marker
            id="arrowNegativeHighlighted"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={selectedLoop ? loopColors[selectedLoop as keyof typeof loopColors] : "#aaa"} />
          </marker>
        </defs>

        {connections.map((connection, idx) => {
          const source = getNodeById(connection.source);
          const target = getNodeById(connection.target);
          if (!source || !target) return null;
          
          const path = calculatePath(connection.source, connection.target);
          const isHighlighted = isConnectionInSelectedLoop(connection.source, connection.target);
          const isNodeHighlighted = highlightedNode === connection.source || highlightedNode === connection.target;
          
          const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
          pathElement.setAttribute("d", path);
          const pathLength = pathElement.getTotalLength ? pathElement.getTotalLength() : 100;
          const point = pathElement.getPointAtLength ? pathElement.getPointAtLength(pathLength * 0.6) : { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 };
          
          return (
            <g key={`connection-${idx}`}>
              <path
                d={path}
                fill="none"
                stroke={
                  isHighlighted 
                    ? loopColors[selectedLoop as keyof typeof loopColors] 
                    : isNodeHighlighted 
                      ? "#000" 
                      : "#aaa"
                }
                strokeWidth={isHighlighted || isNodeHighlighted ? 2.5 : 1.5}
                strokeDasharray={isHighlighted ? "none" : isNodeHighlighted ? "5,5" : "none"}
                opacity={
                  selectedLoop && !isHighlighted && !isNodeHighlighted ? 0.3 : 
                  highlightedNode && !isNodeHighlighted ? 0.3 : 1
                }
                markerEnd={`url(#arrow${connection.relationship === "positive" ? "Positive" : "Negative"}${isHighlighted ? "Highlighted" : ""})`}
              />
              
              <circle 
                cx={point.x} 
                cy={point.y} 
                r={10} 
                fill="white" 
                stroke={isHighlighted ? loopColors[selectedLoop as keyof typeof loopColors] : "#aaa"} 
                strokeWidth="1"
                opacity={selectedLoop && !isHighlighted ? 0.3 : 1}
              />
              <text 
                x={point.x} 
                y={point.y} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fontSize="12"
                fill={isHighlighted ? loopColors[selectedLoop as keyof typeof loopColors] : "#666"}
                opacity={selectedLoop && !isHighlighted ? 0.3 : 1}
              >
                {connection.relationship === "positive" ? "+" : "−"}
              </text>
            </g>
          );
        })}
        
        {nodes.map((node) => {
          const isHighlighted = isNodeInSelectedLoop(node.id);
          const radius = node.radius || 30;
          
          return (
            <g 
              key={node.id} 
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setHighlightedNode(node.id)}
              onMouseLeave={() => setHighlightedNode(null)}
              style={{ cursor: "pointer", transition: "all 0.2s ease" }}
              opacity={
                selectedLoop && !isHighlighted ? 0.4 : 
                highlightedNode && highlightedNode !== node.id ? 0.4 : 1
              }
            >
              <circle
                r={radius}
                fill={isHighlighted ? loopColors[selectedLoop as keyof typeof loopColors] : categoryColors[node.category]}
                stroke={isHighlighted ? "white" : "#fff"}
                strokeWidth={isHighlighted ? 2 : 1}
                className="transition-all duration-200"
              />
              
              <foreignObject 
                x={-radius * 0.9} 
                y={-radius * 0.8} 
                width={radius * 1.8} 
                height={radius * 1.6}
              >
                <div 
                  className="flex items-center justify-center h-full text-center"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <span className={cn(
                    "text-xs font-medium",
                    isHighlighted ? "text-white" : "text-gray-800"
                  )}>
                    {node.label}
                  </span>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CausalLoopDiagram;
