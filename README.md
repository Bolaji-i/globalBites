```markdown
# globalBites - Expo React Native prototype

This is a minimal Expo React Native client for the globalBites project.

Prereqs
- Node.js
- Expo CLI: npm install -g expo-cli
- (Optional) Backend server running (the Express server) at http://localhost:3000

Install & run
1. npm install
2. expo start
3. Open in emulator or Expo Go on your phone.
   - If using a physical device, make sure api.js baseURL points to your machine IP (e.g. http://192.168.x.x:3000/api) or use Expo tunnel.

Notes
- This app expects an API compatible with the Express endpoints:
  GET /api/recipes
  POST /api/recipes
  POST /api/recipes/:id/like
  DELETE /api/recipes/:id
- If you want me to scaffold the backend into the same repo (monorepo), or create the GitHub repo and push these files, say so and I will create the remaining files and push them (I’ll need permission).
```
