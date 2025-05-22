import { MvpPlanResponse, FeaturesResponse, MilestonesResponse, KpisResponse, DiagramsResponse } from '@/types/ai';

// Convert MVP plan data to HTML format that can be rendered and exported
export const generateMvpPlanHtml = (
  projectName: string,
  aiPlan?: { success: boolean; data: MvpPlanResponse } | null,
  aiFeatures?: { success: boolean; data: FeaturesResponse } | null,
  aiMilestones?: { success: boolean; data: MilestonesResponse } | null,
  aiKpis?: { success: boolean; data: KpisResponse } | null,
  aiDiagrams?: { success: boolean; data: DiagramsResponse } | null,
): string => {
  let html = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #4338ca;
          text-align: center;
          font-size: 28px;
          margin-bottom: 30px;
        }
        h2 {
          color: #6366f1;
          font-size: 22px;
          margin-top: 30px;
          border-bottom: 1px solid #d4d4d8;
          padding-bottom: 8px;
        }
        h3 {
          color: #818cf8;
          font-size: 18px;
          margin-top: 20px;
        }
        p {
          margin-bottom: 16px;
        }
        ul {
          margin-bottom: 20px;
        }
        li {
          margin-bottom: 8px;
        }
        .section {
          margin-bottom: 30px;
        }
        .feature-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          background-color: #f9fafb;
        }
        .feature-card h4 {
          margin-top: 0;
          color: #4f46e5;
        }
        .feature-meta {
          display: inline-block;
          background: #e0e7ff;
          color: #4338ca;
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 4px;
          margin-right: 8px;
        }
        .milestone-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          background-color: #f9fafb;
        }
        .milestone-card h4 {
          margin-top: 0;
          color: #4f46e5;
        }
        .milestone-duration {
          float: right;
          background: #e0e7ff;
          color: #4338ca;
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .kpi-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          background-color: #f9fafb;
        }
        .kpi-card h4 {
          margin-top: 0;
          color: #4f46e5;
        }
        .diagram-section {
          margin-top: 40px;
          text-align: center;
        }
        .diagram-section img {
          max-width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-top: 16px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <h1>MVP Plan: ${projectName}</h1>
  `;

  // Executive Summary Section
  if (aiPlan?.success && aiPlan.data) {
    html += `
      <div class="section">
        <h2>Executive Summary</h2>
        <p>${aiPlan.data.executiveSummary}</p>
      </div>
      
      <div class="section">
        <h2>Problem Statement</h2>
        <p>${aiPlan.data.problemStatement}</p>
      </div>
      
      <div class="section">
        <h2>Target Audience</h2>
        <p>${aiPlan.data.targetAudience}</p>
      </div>
      
      <div class="section">
        <h2>Value Proposition</h2>
        <p>${aiPlan.data.valueProposition}</p>
      </div>
      
      <div class="section">
        <h2>MVP Scope</h2>
        <p>${aiPlan.data.mvpScope}</p>
      </div>
      
      <div class="section">
        <h2>Key Features</h2>
        <ul>
          ${aiPlan.data.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <h2>Success Criteria</h2>
        <p>${aiPlan.data.successCriteria}</p>
      </div>
      
      <div class="section">
        <h2>Potential Challenges</h2>
        <p>${aiPlan.data.potentialChallenges}</p>
      </div>
      
      <div class="section">
        <h2>Next Steps</h2>
        <p>${aiPlan.data.nextSteps}</p>
      </div>
    `;
  }

  // Features Section
  if (aiFeatures?.success && aiFeatures.data?.featureIdeas) {
    html += `
      <div class="section">
        <h2>Detailed Feature Breakdown</h2>
    `;

    aiFeatures.data.featureIdeas.forEach(feature => {
      html += `
        <div class="feature-card">
          <h4>${feature.name}</h4>
          <p>
            <span class="feature-meta">Priority: ${feature.priority}</span>
            <span class="feature-meta">Difficulty: ${feature.difficulty}</span>
          </p>
          <p>${feature.description}</p>
          <h5>Value:</h5>
          <p>${feature.value}</p>
          <h5>Implementation Notes:</h5>
          <p>${feature.reasoning}</p>
        </div>
      `;
    });

    html += `</div>`;
  }

  // Milestones Section
  if (aiMilestones?.success && aiMilestones.data?.milestones) {
    html += `
      <div class="section">
        <h2>Development Timeline</h2>
    `;

    const sortedMilestones = [...aiMilestones.data.milestones].sort((a, b) => a.order - b.order);
    
    sortedMilestones.forEach((milestone, index) => {
      html += `
        <div class="milestone-card">
          <h4>${index + 1}. ${milestone.title} <span class="milestone-duration">${milestone.duration} weeks</span></h4>
          <p>${milestone.description}</p>
          
          <h5>Deliverables:</h5>
          <ul>
            ${milestone.deliverables.map(item => `<li>${item}</li>`).join('')}
          </ul>
          
          <h5>Technical Notes:</h5>
          <p>${milestone.technical_notes}</p>
          
          <h5>Validation Steps:</h5>
          <ul>
            ${milestone.validation_steps.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    });

    html += `</div>`;
  }

  // KPIs Section
  if (aiKpis?.success && aiKpis.data?.kpis) {
    html += `
      <div class="section">
        <h2>Key Performance Indicators</h2>
    `;

    aiKpis.data.kpis.forEach(kpi => {
      html += `
        <div class="kpi-card">
          <h4>${kpi.name}</h4>
          <p>${kpi.description}</p>
          
          <h5>Target:</h5>
          <p>${kpi.target}</p>
          
          <h5>Timeframe:</h5>
          <p>${kpi.timeframe}</p>
          
          <h5>Implementation Guide:</h5>
          <p>${kpi.implementation_advice || kpi.implementation}</p>
        </div>
      `;
    });

    html += `</div>`;
  }

  // Diagrams Section with HTML-based diagrams
  if (aiDiagrams?.success && aiDiagrams.data) {
    // Helper function to extract explanation for a specific diagram
    const extractExplanation = (fullExplanation: string, diagramType: string): string => {
      const sections = fullExplanation.split('\n\n');
      for (const section of sections) {
        if (section.toLowerCase().includes(diagramType.toLowerCase())) {
          return section;
        }
      }
      return `This diagram shows the ${diagramType}.`;
    };

    html += `
      <div class="section">
        <h2>System Diagrams</h2>
        
        <div class="diagram-section">
          <h3>User Flow Diagram</h3>
          <div class="diagram-container" style="border: 1px solid #e2e8f0; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <!-- Left flow -->
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 10px;">User</div>
                <div style="margin: 5px;">↓</div>
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 10px;">Explore MVP Ideas</div>
                <div style="margin: 5px;">↓</div>
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center;">Configure Project</div>
              </div>
              
              <!-- Center flow -->
              <div style="display: flex; flex-direction: column; align-items: center; margin: 0 20px;">
                <div style="height: 30px;"></div>
                <div style="margin: 5px;">→</div>
                <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 10px; text-align: center; font-weight: 500; color: #4f46e5;">Create MVP Plan</div>
                <div style="margin: 5px;">→</div>
                <div style="height: 30px;"></div>
              </div>
              
              <!-- Right flow -->
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 10px;">View Results</div>
                <div style="margin: 5px;">↓</div>
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 10px;">Export Plan</div>
                <div style="margin: 5px;">↓</div>
                <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px; text-align: center; color: #047857;">Implement</div>
              </div>
            </div>
          </div>
          <p>${extractExplanation(aiDiagrams.data.explanation, 'User Flow')}</p>
        </div>
        
        <div class="diagram-section">
          <h3>Data Flow Diagram</h3>
          <div class="diagram-container" style="border: 1px solid #e2e8f0; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <!-- Client -->
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; text-align: center;">
                <div style="font-weight: 500;">Client</div>
                <div style="font-size: 12px; color: #64748b;">User Interface</div>
              </div>
              
              <!-- Arrow -->
              <div style="margin: 0 10px;">→</div>
              
              <!-- API -->
              <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 15px; text-align: center;">
                <div style="font-weight: 500;">API</div>
                <div style="font-size: 12px; color: #64748b;">Business Logic</div>
              </div>
              
              <!-- Arrow -->
              <div style="margin: 0 10px;">→</div>
              
              <!-- Database -->
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; text-align: center;">
                <div style="font-weight: 500;">Database</div>
                <div style="font-size: 12px; color: #64748b;">Data Storage</div>
              </div>
            </div>
            
            <!-- Return flow -->
            <div style="display: flex; justify-content: center;">
              <div style="width: 80%; display: flex; justify-content: space-between;">
                <div>←</div>
                <div>←</div>
              </div>
            </div>
          </div>
          <p>${extractExplanation(aiDiagrams.data.explanation, 'Data Flow')}</p>
        </div>
        
        <div class="diagram-section">
          <h3>System Architecture Diagram</h3>
          <div class="diagram-container" style="border: 1px solid #e2e8f0; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <!-- Frontend -->
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px; text-align: center; width: 80%; margin-bottom: 10px;">
                <div style="font-weight: 500;">Frontend</div>
                <div style="font-size: 12px; color: #64748b;">React + TypeScript + TailwindCSS</div>
              </div>
              
              <div style="margin: 5px;">↓</div>
              
              <!-- API Gateway -->
              <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 10px; text-align: center; width: 80%; margin-bottom: 10px;">
                <div style="font-weight: 500;">API Gateway</div>
                <div style="font-size: 12px; color: #64748b;">Express.js RESTful API</div>
              </div>
              
              <div style="margin: 5px;">↓</div>
              
              <!-- Backend Services -->
              <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 10px; text-align: center; width: 80%; margin-bottom: 10px;">
                <div style="font-weight: 500;">Backend Services</div>
                <div style="font-size: 12px; color: #64748b;">Anthropic Claude AI Integration</div>
              </div>
              
              <div style="margin: 5px;">↓</div>
              
              <!-- Database -->
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px; text-align: center; width: 80%;">
                <div style="font-weight: 500;">Database</div>
                <div style="font-size: 12px; color: #64748b;">PostgreSQL with Drizzle ORM</div>
              </div>
            </div>
          </div>
          <p>${extractExplanation(aiDiagrams.data.explanation, 'System Architecture')}</p>
        </div>
      </div>
    `;
  }

  // Footer
  html += `
      <div class="footer">
        <p>Generated by AI MVP Creator | ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;

  return html;
};

// Export MVP plan as PDF
export const exportToPdf = async (
  projectName: string,
  aiPlan?: { success: boolean; data: MvpPlanResponse } | null,
  aiFeatures?: { success: boolean; data: FeaturesResponse } | null,
  aiMilestones?: { success: boolean; data: MilestonesResponse } | null,
  aiKpis?: { success: boolean; data: KpisResponse } | null,
  aiDiagrams?: { success: boolean; data: DiagramsResponse } | null,
): Promise<void> => {
  // Generate the HTML content
  const htmlContent = generateMvpPlanHtml(
    projectName,
    aiPlan,
    aiFeatures,
    aiMilestones,
    aiKpis,
    aiDiagrams
  );
  
  // Create a hidden iframe to print from
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  
  document.body.appendChild(iframe);
  
  // Set iframe content and print when loaded
  iframe.onload = () => {
    if (iframe.contentWindow) {
      const doc = iframe.contentWindow.document;
      
      // Add print styles
      const style = doc.createElement('style');
      style.textContent = `
        @media print {
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          h1 { font-size: 24px; }
          h2 { font-size: 18px; }
          h3 { font-size: 16px; }
          .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 9px;
            color: #666;
          }
          @page {
            margin: 1cm;
          }
        }
      `;
      doc.head.appendChild(style);
      
      // Add page title
      const title = doc.createElement('title');
      title.textContent = `MVP Plan: ${projectName}`;
      doc.head.appendChild(title);
      
      // Add content
      doc.body.innerHTML = htmlContent;
      
      // Timeout to ensure content is rendered
      setTimeout(() => {
        iframe.contentWindow?.print();
        
        // Remove iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };
  
  iframe.srcdoc = htmlContent;
};

// Export MVP plan as DOCX - temporarily using HTML export as DOCX is not working reliably
export const exportToDocx = async (
  projectName: string,
  aiPlan?: { success: boolean; data: MvpPlanResponse } | null,
  aiFeatures?: { success: boolean; data: FeaturesResponse } | null,
  aiMilestones?: { success: boolean; data: MilestonesResponse } | null,
  aiKpis?: { success: boolean; data: KpisResponse } | null,
  aiDiagrams?: { success: boolean; data: DiagramsResponse } | null,
): Promise<void> => {
  // Generate HTML content
  const htmlContent = generateMvpPlanHtml(
    projectName,
    aiPlan,
    aiFeatures,
    aiMilestones,
    aiKpis,
    aiDiagrams
  );

  try {
    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link for the HTML file (user can open in Word)
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_MVP_Plan.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Alert the user about opening in Word
    alert('Your plan has been exported as an HTML file. You can open this file in Microsoft Word and then save it as a DOCX file.');
  } catch (error) {
    console.error('Error generating HTML for Word:', error);
    throw error;
  }
};