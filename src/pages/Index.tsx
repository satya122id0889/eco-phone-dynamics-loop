
import React from "react";
import CausalLoopDiagram from "@/components/CausalLoopDiagram";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Causal Loop Diagram: Sustainable Smartphone Ecosystem
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            This diagram illustrates the complex interactions between material sourcing, user behavior, 
            economic factors, environmental impacts, and innovation in the smartphone ecosystem.
          </p>
        </header>
        
        <div className="mb-8 rounded-xl shadow-md overflow-hidden border border-gray-200">
          <CausalLoopDiagram className="h-[650px] md:h-[800px]" />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Key Feedback Loops</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 pl-4" style={{ borderColor: "#8BC34A" }}>
              <h3 className="font-bold text-lg">R1: Demand & Waste Loop (Reinforcing)</h3>
              <p className="text-gray-700 mt-1">
                Increased demand for new features drives more frequent manufacturing, 
                generating more e-waste, which increases recycling demand and encourages 
                the use of recycled materials. This can potentially reduce raw material sourcing.
              </p>
            </div>
            
            <div className="border-l-4 pl-4" style={{ borderColor: "#03A9F4" }}>
              <h3 className="font-bold text-lg">R2: Smart Use Behavior Loop (Reinforcing)</h3>
              <p className="text-gray-700 mt-1">
                Digital minimalism (using minimal UI/voice modes) reduces screen time and battery drain, 
                leading to less frequent charging, longer battery lifespan, extended device longevity, 
                and ultimately a reduced replacement rate.
              </p>
            </div>
            
            <div className="border-l-4 pl-4" style={{ borderColor: "#FF9800" }}>
              <h3 className="font-bold text-lg">B1: Modularity Reduces Waste (Balancing)</h3>
              <p className="text-gray-700 mt-1">
                Increased modularity improves repairability, extending device lifespan. This reduces 
                the need for replacement parts, lowers manufacturing demand, and ultimately decreases 
                carbon emissions and e-waste generation.
              </p>
            </div>
            
            <div className="border-l-4 pl-4" style={{ borderColor: "#E91E63" }}>
              <h3 className="font-bold text-lg">B2: Recycling Stabilizer Loop (Balancing)</h3>
              <p className="text-gray-700 mt-1">
                E-waste generation increases material recovery and the supply of recycled materials, 
                which reduces the need for virgin material mining. This lowers environmental impact 
                and slows the rise of new e-waste generation.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">How to Read This Diagram</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Nodes (Circles):</strong> Represent variables in the system</li>
              <li><strong>Arrows:</strong> Show causal relationships between variables</li>
              <li><strong>+ Sign:</strong> Indicates a positive relationship (variables change in the same direction)</li>
              <li><strong>− Sign:</strong> Indicates a negative relationship (variables change in opposite directions)</li>
              <li><strong>R Loops:</strong> Reinforcing loops that amplify change in the system</li>
              <li><strong>B Loops:</strong> Balancing loops that stabilize or counter change in the system</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
