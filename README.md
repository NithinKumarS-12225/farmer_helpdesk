# Krushi sahay - AI-Powered Agricultural Helpdesk

A comprehensive full-stack web application designed to empower Indian farmers with expert guidance, real-time weather analysis, government schemes information, marketplace services, and AI-powered query assistance.

## 🌾 Features

### 1. **Farmer Query Assistant** (AI-Powered with Groq Llama 3.3)
- Real-time chat interface for farming questions
- Context-aware responses using agricultural knowledge base
- Supports multiple languages (English, Hindi, Kannada)
- Chat history and saved queries
- Integration with Kaggle Farmers Call Query Data

### 2. **Expert Directory**
- 10+ government-approved agricultural experts
- Search and filter by specialty, experience, location
- Contact information and service area details
- Multi-language support

### 3. **Farmer Products Marketplace**
- List agricultural products with detailed information
- Dropdown selections for crop type, land size, location
- Quantity and price management
- Product inquiry system
- Local storage for product listings

### 4. **Real-Time Weather Analysis**
- Current weather conditions with agricultural insights
- 7-day weather forecast
- Geolocation-based weather data
- Farming recommendations based on weather
- Activity recommendations and warnings

### 5. **Government Schemes & Loans**
- 10+ government agricultural schemes database
- Loan programs with eligibility and terms
- Detailed scheme information with benefits
- Application process guidance
- State-wise availability tracking

### 6. **Account Settings**
- User profile management
- Light/Dark theme toggle
- Language preferences (English, Hindi, Kannada)
- Notification settings
- Privacy and security options

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **AI/LLM**: Groq (llama-3.3-70b-versatile)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Internationalization**: next-intl (custom implementation)
- **State Management**: React Hooks + localStorage
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ or higher
- npm or pnpm package manager
- Groq API Key (for AI queries)

## 🚀 Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

   Get your Groq API key from: https://console.groq.com

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
/app
  /[locale]              # Localized route segments
    /farmer              # AI Query Assistant
    /experts             # Expert Directory
    /marketplace         # Products Marketplace
    /weather             # Weather Analysis
    /schemes             # Government Schemes
    /account             # Account Settings
  /api
    /groq-query         # Groq LLM API endpoint
/components
  /ui                    # shadcn/ui components
  Navigation.tsx         # Main navigation component
  ThemeProvider.tsx      # Theme management
/data
  /farmers-queries.json  # Kaggle dataset
  /experts.json          # Expert directory
  /schemes.json          # Government schemes
  /crops.json            # Crop database
/lib
  groq.ts               # Groq client setup
  translations.ts       # Translation utilities
/translations
  en.json               # English translations
  hi.json               # Hindi translations
  kn.json               # Kannada translations
```

## 🌐 Supported Languages

- **English** (en) - Default
- **Hindi** (hi) - हिन्दी
- **Kannada** (kn) - ಕನ್ನಡ

Switch languages using the globe icon in the navigation bar.

## 🎨 Design Features

### Color Palette (Agricultural Theme)
- **Primary Green**: Represents crops and growth
- **Secondary Earth**: Represents soil and cultivation
- **Accent Gold**: Represents harvest and prosperity
- **Light Cream**: Professional background
- **Dark mode** support for reduced eye strain

### Responsive Design
- Mobile-first approach
- Fully responsive on all screen sizes
- Touch-friendly interface for mobile users

### Accessibility
- WCAG 2.1 compliant
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support

## 💾 Data Management

### Embedded Data Sources
- **Farmers Queries**: 10+ example agricultural queries and solutions
- **Experts**: Mock government-approved expert profiles
- **Schemes**: 10+ government schemes with loan programs
- **Crops**: Database of major Indian crops with seasons

### Storage
- **localStorage**: User preferences, chat history, marketplace listings
- **API**: Groq queries for AI responses

## 🔌 API Integration

### Groq Query Endpoint
- **Route**: `/api/groq-query`
- **Method**: POST
- **Payload**: `{ query: string, language: string }`
- **Response**: `{ response: string }`

Example usage:
```javascript
const response = await fetch('/api/groq-query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'How to control powdery mildew in wheat?',
    language: 'en'
  })
});
```

## 🎯 How to Use

### For Farmers
1. Visit the **Farmer Chat** section to ask agricultural questions
2. Browse **Expert Directory** to find specialists for your region
3. Check **Real-Time Weather** for farming decisions
4. Explore **Government Schemes** for financial aid and insurance
5. List your products in the **Marketplace**
6. Manage preferences in **Account Settings**

### For Developers
1. Customize the color palette in `app/globals.css`
2. Add new experts in `data/experts.json`
3. Extend queries in `data/farmers-queries.json`
4. Create new scheme entries in `data/schemes.json`
5. Translate UI text in `translations/`

## 🔐 Security Considerations

- Groq API key stored in server-side environment variables
- No sensitive data stored in localStorage
- Input validation on forms
- CORS enabled for safe API calls

## 📊 Future Enhancements

- Database integration (PostgreSQL/Supabase)
- User authentication system
- Weather API integration (OpenWeatherMap)
- SMS notifications for alerts
- Image upload for marketplace products
- Video tutorials in regional languages
- Crop recommendation engine
- Pest detection via image upload
- Payment integration for marketplace
- Expert rating and review system

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📞 Support

For issues or questions:
1. Check the GitHub issues page
2. Review the documentation
3. Contact the development team

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from shadcn/ui
- AI powered by Groq
- Agricultural data from Indian Ministry of Agriculture
- Icons by Lucide React

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Active Development

Made with ❤️ for Indian farmers
