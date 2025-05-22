# MVP Planning Assistant

An AI-powered MVP Planning Assistant that transforms entrepreneurial ideas into structured project roadmaps with intelligent guidance and intuitive design tools.

![MVP Planning Assistant](generated-icon.png)

## Overview

The MVP Planning Assistant is a web application designed to help entrepreneurs and product managers plan their Minimum Viable Products (MVPs) efficiently. By leveraging the power of AI (Claude), the application generates comprehensive MVP plans based on user inputs, complete with features, milestones, KPIs, and flow diagrams.

## Key Features

### AI-Powered Plan Generation
- Generate complete MVP plans using Anthropic Claude AI
- Automated feature suggestions based on project details
- AI-generated milestones for project implementation
- KPI recommendations for success measurement
- Flow diagrams for data and user journeys

### Document Export Options
- Export plans as PDF for stakeholder presentations
- Markdown export for documentation
- DOCX format for traditional document workflows

### Visualization 
- Interactive flow diagrams to visualize product architecture
- User journey maps to understand user interactions
- System architecture diagrams for implementation planning

### Project Management
- Save and retrieve MVP plans
- User authentication system
- Admin dashboard for user and project management

### Responsive UI
- Clean, intuitive interface based on modern design principles
- Progress indicators for AI generation steps
- Responsive layout for all device sizes

## Technical Implementation

### Frontend
- React with TypeScript for type-safe components
- Tailwind CSS with shadcn/ui components for modern UI
- Wouter for lightweight routing
- TanStack React Query for data fetching and state management
- Lucide React for consistent iconography

### Backend
- Express.js server with TypeScript
- PostgreSQL database for persistent storage
- Drizzle ORM for type-safe database operations
- Passport.js for authentication
- Session-based user management

### AI Integration
- Anthropic Claude API for natural language processing
- AI-powered content generation for all plan components
- Flow diagram generation with custom algorithms

### Security & User Management
- User authentication with secure password handling
- Role-based access control (admin/regular users)
- Session management and secure cookie handling
- Protected routes with authentication checks

## Architecture

The application follows a modern web architecture:

1. **Client-side rendering** with React for a dynamic UI
2. **API-driven backend** handling data persistence and AI operations
3. **Database layer** using PostgreSQL for structured data storage
4. **AI integration layer** communicating with Anthropic Claude API

## User Roles

### Regular Users
- Create and manage their MVP plans
- Generate AI-powered content for their projects
- Export plans in various formats
- View and edit only their own plans

### Admin Users
- Access to all user plans across the platform
- View all registered users in the Members section
- System-wide visibility for monitoring and support
- Default admin credentials: username `admin`, password `admin`

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Anthropic API key

### Installation
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (especially `ANTHROPIC_API_KEY`)
4. Initialize the database with `npm run db:push`
5. Start the development server with `npm run dev`

## Usage Flow

1. **Authentication**: Log in or register to access the system
2. **Create Project**: Enter basic project information (name, industry, problem statement)
3. **AI Generation**: Let the AI generate features, milestones, and KPIs
4. **Review & Customize**: Review AI suggestions and customize as needed
5. **Visualize**: View and customize flow diagrams
6. **Export**: Export your MVP plan in your preferred format

## Design Principles

The application adheres to the following design principles:

1. **Simplicity**: Clean UI with clear navigation and purpose
2. **Guidance**: Progressive disclosure of information to guide users
3. **Visual Hierarchy**: Important content is emphasized through size and weight
4. **Responsiveness**: Adapts to different screen sizes and devices
5. **Consistency**: Uniform patterns and components throughout the application

## Future Enhancements

Potential future enhancements include:

1. Team collaboration features
2. Advanced project analytics
3. Integration with project management tools
4. Enhanced AI capabilities with custom training
5. Additional export formats and integration options

## License

This project is proprietary and confidential.

## Acknowledgements

- Anthropic Claude for AI capabilities
- React and the entire frontend ecosystem
- The Drizzle ORM team for database tooling
- shadcn/ui for the UI component system