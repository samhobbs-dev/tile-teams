# Tile Teams

This project aims to provide a comprehensive history of college football, including team records, schedules, and rankings. The application is built using React and TypeScript, with data fetched from various APIs and stored in a database.

## Features

- View team records and schedules
- View conference standings
- View AP rankings
- Responsive design for mobile and desktop

## TODOs

### 1. Adding Backgrounds for Every Year

- Implement a feature to display different backgrounds for each year.
- Ensure that the backgrounds are responsive and do not affect the readability of the content.

### 2. Adding Admin Login to Manually Adjust Database Records & Dimensions (Optional)

- Create an admin login page.
- Implement authentication and authorization for admin users.
- Provide an interface for admins to manually adjust database records and dimensions.

### 3. View Games in More Detail by Hovering Over Them

- Implement a feature to display detailed information about games when hovering over them.
- Ensure that the hover effect is smooth and does not interfere with other elements on the page.

### 4. Toggle to Sort by Record or Alphabetically

- Add a toggle button to switch between sorting teams by their record or alphabetically.
- Ensure that the sorting is applied consistently across all relevant components.

### 5. Find Other APIs to Query From & Convert

- Research and identify additional APIs that provide relevant data.
- Implement data fetching from the new APIs.
- Convert and integrate the data into the existing application structure.

### 6. Update Logos (e.g., 2023 & Onwards Updates)

- Update team logos to reflect the latest changes (e.g., 2023 updates).
- Ensure that the logos are displayed correctly across all components.

### 7. Add read-only access

- Create Supabass read-only URL for database
- Enable users to clone & use repository without additional configuration or automation.

### 8. Add IP tracking and similar analysis

- Because it's only fair to know who and when people are accessing your site.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tile-teams.git
   ```
2. Navigate to the project directory:
   ```bash
   cd tile-teams
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

### IMPORTANT

Your environment or .env file must set the variables DATABASE_URL (as per the Prisma schema), NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (used in src/lib/supabaseClient.ts to authenticate with the Supabase backend).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License.
