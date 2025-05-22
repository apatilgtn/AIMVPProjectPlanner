import Anthropic from '@anthropic-ai/sdk';

// The newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const MODEL = 'claude-3-7-sonnet-20250219';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface MvpGenerationRequest {
  projectName: string;
  industry: string;
  targetAudience: string;
  problemStatement: string;
  keyBenefits: string[];
  additionalNotes?: string;
  features?: Array<{
    name: string;
    description: string;
    priority: string;
    difficulty: string;
  }>;
  competitors?: Array<{
    name: string;
    features: string[];
  }>;
}

export async function generateMvpPlan(data: MvpGenerationRequest) {
  try {
    const prompt = `
    You are an expert MVP planning assistant helping a client design their Minimum Viable Product.
    
    Here's the information about their project:
    - Project Name: ${data.projectName}
    - Industry: ${data.industry}
    - Target Audience: ${data.targetAudience}
    - Problem Statement: ${data.problemStatement}
    - Key Benefits: ${data.keyBenefits.join(', ')}
    ${data.additionalNotes ? `- Additional Notes: ${data.additionalNotes}` : ''}
    
    ${data.features && data.features.length > 0 ? `
    Features they're considering:
    ${data.features.map(f => `- ${f.name} (${f.priority} priority, ${f.difficulty} difficulty): ${f.description}`).join('\n')}
    ` : ''}
    
    ${data.competitors && data.competitors.length > 0 ? `
    Competitors and their features:
    ${data.competitors.map(c => `- ${c.name}: ${c.features.join(', ')}`).join('\n')}
    ` : ''}
    
    Based on this information, generate a structured JSON response with the following sections:
    
    1. executiveSummary: Brief overview of the project MVP (3-5 sentences)
    2. problemStatement: Refined problem statement that clearly identifies the pain points
    3. targetAudience: Detailed description of the primary users
    4. valueProposition: What unique benefit does this product provide
    5. mvpScope: What's included and excluded from the MVP, with clear boundaries
    6. keyFeatures: Array of 5-8 specific features to prioritize (just names/one-liners)
    7. successCriteria: How to measure if the MVP is successful
    8. potentialChallenges: Anticipated obstacles and how to address them
    9. nextSteps: The immediate actions to take after MVP launch
    
    You MUST respond with ONLY valid JSON, formatted exactly as described with these exact field names.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        { role: 'user', content: prompt }
      ],
      system: "You're an MVP Planning Expert. Always output in valid JSON format with the following structure exactly: { 'executiveSummary': string, 'problemStatement': string, 'targetAudience': string, 'valueProposition': string, 'mvpScope': string, 'keyFeatures': string[], 'successCriteria': string, 'potentialChallenges': string, 'nextSteps': string }",
    });

    // Extract the text content
    const content = response.content[0].type === 'text' 
                    ? response.content[0].text 
                    : JSON.stringify({ message: "Unable to get text content" });

    // Extract and parse the JSON response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/({[\s\S]*})/) || 
                      [null, content];
    
    const jsonContent = jsonMatch[1].trim();
    const parsedPlan = JSON.parse(jsonContent);
                    
    return {
      success: true,
      data: parsedPlan
    };
  } catch (error) {
    console.error('Error generating MVP plan with Anthropic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function generateFeatureIdeas(data: MvpGenerationRequest) {
  try {
    const prompt = `
    You are an expert MVP planning assistant helping a client brainstorm innovative features for their product.
    
    Here's the information about their project:
    - Project Name: ${data.projectName}
    - Industry: ${data.industry}
    - Target Audience: ${data.targetAudience}
    - Problem Statement: ${data.problemStatement}
    - Key Benefits: ${data.keyBenefits.join(', ')}
    
    Based on this information, please generate:
    
    1. 8-10 innovative feature ideas for their MVP, including:
       - Feature name
       - Brief description (1-2 sentences)
       - Why this feature is valuable to users
       - Recommended priority (High/Medium/Low)
       - Estimated implementation difficulty (Easy/Medium/Hard)
    
    2. For each feature, explain:
       - How it addresses the core problem
       - Its unique value proposition
       - Ways to simplify it for MVP implementation
    
    Please format your response as structured JSON that can be parsed, with feature ideas as an array where each item has the fields: name, description, value, priority, difficulty, and reasoning.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        { role: 'user', content: prompt }
      ],
      system: "You're a Feature Development Expert specialized in MVP planning. Always output in valid JSON format with the following structure: { 'featureIdeas': [ { 'name': string, 'description': string, 'value': string, 'priority': string, 'difficulty': string, 'reasoning': string } ] }",
    });

    // Extract the text content
    const content = response.content[0].type === 'text' 
                    ? response.content[0].text 
                    : JSON.stringify({ message: "Unable to get text content" });

    // Extract and parse the JSON response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/({[\s\S]*})/) || 
                      [null, content];
    
    const jsonContent = jsonMatch[1].trim();
    const parsedFeatures = JSON.parse(jsonContent);

    return {
      success: true,
      data: parsedFeatures
    };
  } catch (error) {
    console.error('Error generating feature ideas with Anthropic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function generateMilestones(data: MvpGenerationRequest) {
  try {
    const prompt = `
    You are an expert project manager helping a client create a realistic timeline for their MVP development.
    
    Here's the information about their project:
    - Project Name: ${data.projectName}
    - Industry: ${data.industry}
    - Problem Statement: ${data.problemStatement}
    
    ${data.features && data.features.length > 0 ? `
    Features to be implemented:
    ${data.features.map(f => `- ${f.name} (${f.priority} priority, ${f.difficulty} difficulty): ${f.description}`).join('\n')}
    ` : ''}
    
    Based on this information, please generate:
    
    1. A realistic timeline with 5-7 major milestones for the MVP development, including:
       - Milestone title
       - Brief description of what will be accomplished
       - Estimated duration (in weeks)
       - Logical order/sequence number
    
    2. For each milestone, include:
       - Key deliverables
       - Technical considerations
       - Testing/validation requirements
    
    Please create a realistic schedule that accounts for the scope of work. Format your response as structured JSON that can be parsed, with milestones as an array of objects containing: title, description, duration, order, deliverables, technical_notes, and validation_steps.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        { role: 'user', content: prompt }
      ],
      system: "You're a Project Management Expert specialized in MVP development timelines. Always output in valid JSON format with the following structure: { 'milestones': [ { 'title': string, 'description': string, 'duration': number, 'order': number, 'deliverables': string[], 'technical_notes': string, 'validation_steps': string[] } ] }",
    });

    // Extract the text content
    const content = response.content[0].type === 'text' 
                    ? response.content[0].text 
                    : JSON.stringify({ message: "Unable to get text content" });

    // Extract and parse the JSON response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/({[\s\S]*})/) || 
                      [null, content];
    
    const jsonContent = jsonMatch[1].trim();
    const parsedMilestones = JSON.parse(jsonContent);

    return {
      success: true,
      data: parsedMilestones
    };
  } catch (error) {
    console.error('Error generating milestones with Anthropic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function generateKpis(data: MvpGenerationRequest) {
  try {
    const prompt = `
    You are an expert business analyst helping a client define meaningful KPIs for their MVP.
    
    Here's the information about their project:
    - Project Name: ${data.projectName}
    - Industry: ${data.industry}
    - Target Audience: ${data.targetAudience}
    - Problem Statement: ${data.problemStatement}
    - Key Benefits: ${data.keyBenefits.join(', ')}
    
    Based on this information, please generate:
    
    1. 6-8 specific, measurable KPIs that will help them evaluate the success of their MVP, including:
       - KPI name
       - Description and calculation method
       - Target value
       - Measurement timeframe
       - Why this KPI is important for this specific project
    
    2. For each KPI, provide:
       - Implementation advice
       - How to interpret results
       - Benchmarks or industry standards if applicable
    
    Please focus on meaningful metrics that will truly validate their business model, not vanity metrics. Format your response as structured JSON that can be parsed, with KPIs as an array.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        { role: 'user', content: prompt }
      ],
      system: "You're a Business Analytics Expert specialized in startup metrics. Always output in valid JSON format with the following structure: { 'kpis': [ { 'name': string, 'description': string, 'target': string, 'timeframe': string, 'importance': string, 'implementation': string, 'interpretation': string, 'benchmarks': string } ] }",
    });

    // Extract the text content
    const content = response.content[0].type === 'text' 
                    ? response.content[0].text 
                    : JSON.stringify({ message: "Unable to get text content" });

    // Extract and parse the JSON response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/({[\s\S]*})/) || 
                      [null, content];
    
    const jsonContent = jsonMatch[1].trim();
    const parsedKpis = JSON.parse(jsonContent);

    return {
      success: true,
      data: parsedKpis
    };
  } catch (error) {
    console.error('Error generating KPIs with Anthropic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function generateFlowDiagram(data: MvpGenerationRequest) {
  try {
    const prompt = `
    You are an expert system designer helping a client visualize the flows and architecture for their MVP product.
    
    Here's the information about their project:
    - Project Name: ${data.projectName}
    - Industry: ${data.industry}
    - Target Audience: ${data.targetAudience}
    - Problem Statement: ${data.problemStatement}
    - Key Benefits: ${data.keyBenefits.join(', ')}
    
    ${data.features && data.features.length > 0 ? `
    Features to be implemented:
    ${data.features.map(f => `- ${f.name} (${f.priority} priority, ${f.difficulty} difficulty): ${f.description}`).join('\n')}
    ` : ''}
    
    Based on this information, please generate THREE distinct diagrams:
    
    1. USER FLOW DIAGRAM: A comprehensive flowchart that shows the end-to-end journey of users through the application.
       - Focus on user interactions and screens/pages they'll navigate through
       - Highlight decision points and different paths users might take
       - Keep it simple and easy to understand
       - Use flowchart LR or TB direction for better readability

    2. DATA FLOW DIAGRAM: Shows how information moves through the system.
       - Identify key data entities and their relationships
       - Show data processing steps
       - Indicate storage points and data transformations
       - Use flowchart LR or TB direction for better readability

    3. SYSTEM ARCHITECTURE DIAGRAM: Shows the high-level technical components.
       - Display the frontend, backend, and any third-party services
       - Show the relationships between different system components
       - Include databases, APIs, and external integrations
       - Use flowchart LR or TB direction for better readability
    
    4. Provide a detailed explanation for each diagram explaining what it shows and key components.

    VERY IMPORTANT:
    - For each diagram, use proper Mermaid.js flowchart syntax starting with "flowchart LR" or "flowchart TB"
    - Use clear node names (A, B, C, or descriptive IDs like login, dashboard, etc.)
    - Ensure diagram complexity is appropriate for rendering (not too many nodes)
    - Make sure the diagrams have proper spacing and formatting
    - Do NOT include any markdown code block markers (like \`\`\`mermaid)
    - Make sure to escape any special characters that might break JSON parsing
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3000,
      messages: [
        { role: 'user', content: prompt }
      ],
      system: "You're a System Design Expert creating flow diagrams for the user's MVP. For each diagram, use VALID Mermaid.js syntax. Output JSON with this structure: { 'userFlowDiagram': string, 'dataFlowDiagram': string, 'systemArchitectureDiagram': string, 'explanation': string }. NO markdown code blocks or backticks in your diagrams! Each diagram should start with 'flowchart LR' or 'flowchart TB' and include proper nodes and connections. Keep diagrams simple and clear with proper node IDs.",
    });

    // Extract the text content
    const content = response.content[0].type === 'text' 
                    ? response.content[0].text 
                    : JSON.stringify({ message: "Unable to get text content" });

    // Extract and parse the JSON response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/({[\s\S]*})/) || 
                      [null, content];
    
    let jsonContent = jsonMatch[1].trim();
    
    // Further sanitize the content to ensure it's valid JSON - sometimes Claude adds trailing commas
    jsonContent = jsonContent.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    
    try {
      const parsedDiagrams = JSON.parse(jsonContent);

      // Sanitize each diagram to ensure it's valid Mermaid
      const sanitizeDiagram = (diagram: string) => {
        if (!diagram) return 'flowchart LR\n  A[Error] --> B[No diagram available]';
        
        // Remove any mermaid markers
        let cleaned = diagram
          .replace(/```mermaid\n?/g, '')
          .replace(/\n?```/g, '')
          .trim();
          
        // Ensure the diagram starts with flowchart
        if (!cleaned.startsWith('flowchart')) {
          cleaned = 'flowchart LR\n' + cleaned;
        }
        
        return cleaned;
      };

      // Sanitize all diagrams
      const sanitizedDiagrams = {
        userFlowDiagram: sanitizeDiagram(parsedDiagrams.userFlowDiagram),
        dataFlowDiagram: sanitizeDiagram(parsedDiagrams.dataFlowDiagram),
        systemArchitectureDiagram: sanitizeDiagram(parsedDiagrams.systemArchitectureDiagram),
        explanation: parsedDiagrams.explanation || 'Explanation not available.'
      };

      return {
        success: true,
        data: sanitizedDiagrams
      };
    } catch (jsonError) {
      console.error('Error parsing diagram JSON:', jsonError);
      
      // Attempt to construct a basic valid response
      return {
        success: true,
        data: {
          userFlowDiagram: 'flowchart LR\n  A[Start] --> B[User Action] --> C[Result]',
          dataFlowDiagram: 'flowchart LR\n  A[Data Source] --> B[Processing] --> C[Storage]',
          systemArchitectureDiagram: 'flowchart LR\n  A[Frontend] --> B[API] --> C[Database]',
          explanation: 'Basic diagram structure. The actual diagram generation encountered an error: ' + 
                      (jsonError instanceof Error ? jsonError.message : 'Unknown parsing error')
        }
      };
    }
  } catch (error) {
    console.error('Error generating flow diagrams with Anthropic:', error);
    
    // Return fallback diagrams
    return {
      success: true,
      data: {
        userFlowDiagram: 'flowchart LR\n  A[Start] --> B[User Action] --> C[Result]',
        dataFlowDiagram: 'flowchart LR\n  A[Data Source] --> B[Processing] --> C[Storage]',
        systemArchitectureDiagram: 'flowchart LR\n  A[Frontend] --> B[API] --> C[Database]',
        explanation: 'Basic diagram structure. The actual diagram generation encountered an error: ' + 
                     (error instanceof Error ? error.message : 'Unknown error occurred')
      }
    };
  }
}