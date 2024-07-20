# 2zero48

## Project Description
2zero48 is a multiplayer version of the classic 2048 game. Players can create rooms and challenge others to a 1v1 match over the internet.

## Gameplay

![2zero48](https://github.com/user-attachments/assets/43f810c1-5b1f-4a2d-a893-c78cedf132ec)

## Technologies Used
- React
- Express
- Node.js
- Socket.io

## Installation Instructions
Ensure you have the following installed:
- Node.js
- npm

Install the necessary dependencies:
```bash
npm i
```

## Usage Instructions
1. **Start the Server:**
    - Navigate to the `server/` directory.
    - Run the server with:
      ```bash
      npm start
      ```

2. **Configure the Client:**
    - Open `client/src/index.js`.
    - Modify line 11 to connect to your server:
      ```javascript
      const socket = io.connect('put_url_here');
      ```

3. **Start the Client:**
    - Navigate to the `client/` directory.
    - Run the client with:
      ```bash
      npm start
      ```

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

## Credits
- Animations by Romain Cousin
- Helper functions by Ivan Vergiliev

## Live Demo
Check out the live demo: [2zero48](https://2zero48.netlify.app)
