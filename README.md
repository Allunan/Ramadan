# Collective

This template is crafted by "**Collective**", a group of Moroccan web developers dedicated to simplifying project initiation and collaboration. Our mission focuses on contributing to open-source projects, particularly in the realm of creative development.

## Routing

this template uses `generouted/react-router` for routing, in generouted, pages are created in the `src/pages` directory. for more information, see the [generouted documentation](https://github.com/oedotme/generouted/blob/main/packages/generouted/readme.md#conventions)

## Folder Structure

The project is structured as follows:

- `src/`: This directory contains all the source code for the project, organized into the following subdirectories:

  - `components/`: Contains all reusable UI components, categorized for better organization and maintainability:

    | Directory    | Description                                                                                                                        | Example                                   |
    | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
    | `global/`    | Project-wide, high-level components used across the entire application. These often handle structural elements.                    | Header, Footer, Navigation                |
    | `layouts/`   | Components defining page structure and layout, managing the arrangement of other components.                                       | Sidebar Layout, Two-Column Layout         |
    | `modules/`   | Self-contained, feature-specific components encapsulating logic and presentation for a particular feature.                         | Login Form, Product Card, Comment Section |
    | `shared/`    | Reusable, low-level UI elements shared across multiple modules and layouts. These are the basic building blocks.                   | Button, Input, Icon                       |
    | `utilities/` | Presentational components providing styling or layout utilities. Primarily for applying consistent spacing, margins, padding, etc. | Spacers, Wrappers                         |

  - `constants/`: Contains project-wide constants, such as API endpoints, configuration values, or fixed strings. This helps avoid magic strings and makes it easier to manage configuration.

  - `data/`: Contains static data used by the application, such as JSON files, mock data for development, or initial state data.

  - `features/`: Houses feature-specific logic, often including components, services, and related logic. This helps to group related code and improve organization for larger applications. For example, a "user authentication" feature might reside here.

  - `hooks/`: Contains custom React hooks that encapsulate reusable logic. This promotes code reuse and keeps components cleaner.

  - `pages/`: Contains the top-level components that represent individual pages in the application. These components orchestrate the use of other components, data, and logic. See the [Routing section](#routing) for more details on page structure and routing.

  - `services/`: Contains services that handle business logic, API calls, data fetching, or other tasks that are not directly tied to a specific component. This promotes separation of concerns and makes code more testable.

  - `stores/`: Contains state management logic, often using a state management library ( `Zustand` in our case), or Context API. This helps manage application state in a predictable way.

  - `styles/`: Contains global styles, CSS variables, and other styling resources. This ensures consistent styling across the application.

  - `types/`: Contains TypeScript type definitions or Flow type annotations. This improves code maintainability and helps catch errors during development.

  - `utils/`: Contains utility functions that are used throughout the project. These are often small, reusable functions that perform specific tasks, such as date formatting, string manipulation, or data transformation.
