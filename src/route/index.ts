let express = require("express")
import routeradminpanel from './adminPanel'
const app = express();
app.use('/api',routeradminpanel)
export default app