import * as express         from 'express'

import { checkTokenIsValid } from '../middleware/checkAccessTokenValid'

import * as coreController  from '../controllers/core.controller'

const router = express.Router()

router.get('/me', checkTokenIsValid, coreController.getMyDetails)

router.get('/me/analyze', checkTokenIsValid, coreController.analyzeMyData)

router.get('/me/data', checkTokenIsValid, coreController.getMyAnalysis)    

router.get('/me/compare', checkTokenIsValid, coreController.compareDataToUser)    

router.get('/me/topFifty', checkTokenIsValid, coreController.getTop50Tracks)

router.get('/user/:userId/analyze', checkTokenIsValid, coreController.analyzePublicUserData) // Delete this once done development

export { router }