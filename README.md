# [Dashboard](https://dashboard.josephtalon.ca)
This web app is intended to be used as a homepage for the browser. It allows the user to create a homepage environment customized to their needs.

## Table of Contents
* [Features](#features)
  + [Change background](#change-background)
  + [Toggle dark mode](#toggle-dark-mode)
  + [Add and customize any shortcut](#add-and-customize-any-shortcut)
  + [Change search engines](#change-search-engines)
  + [Toggle date and time](#toggle-date-and-time)
* [Planned Features](#planned-features)
* [Technology](#technology)


## Features
### Change background
The user can change the background to any color or upload their own wallpaper.

| Color selection | Applied color |
| ---- | ---- |
| ![color selection](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/color-select.png) | ![applied color](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/color-applied.png) |

| Wallpaper selection | Applied wallpaper |
| ---- | ---- |
| ![wallpaper selection](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/wallpaper-select.png) | ![applied wallpaper](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/wallpaper-applied.png)

### Toggle dark mode

| Dark mode | Light mode |
| --- | --- |
| ![dark mode enabled](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/dark-mode.png) | ![light mode enabled](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/light-mode.png) |

### Add and customize any shortcut
Add a shortcut to any URL and use a custom icon and name. Shortcuts can also be reordered with drag and drop when in edit mode.

| Create shortcut menu | New shortcut on grid |
| --- | --- |
| ![create shortcut menu](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/create-app.png) | ![new shortcut on grid](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/new-app.png) |

| Upload custom icon | Custom icon applied |
| --- | --- |
| ![upload custom icon](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/upload-icon.png) | ![applied icon](https://jtalon-cdn.nyc3.digitaloceanspaces.com/images/BrowserDashboard/readme-images/applied-icon.png) |

### Change search engines
Set a preferred search engine. Any queries typed into the search bar will be redirected to the preferred search engine.

### Toggle date and time
Turn on/off either the date or time. 24 hour format may also be selected. Custom date formats are also supported. The user may also adjust the size of the date or time.

## Planned Features
- Change shortcut size
- Allow creation of folders/groups for shortcuts
- Implement caching for faster loading
- Allow cache only
  - User would not have to login/register. All settings would be stored locally
 
## Technology
This web app was developed using SvelteKit for the client and Supabase for the database and storage. The client interacts with the database using the Supabase API.
