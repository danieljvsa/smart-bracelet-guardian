const express = require('express')
const routes = express.Router()

const ProfileController = require('./controllers/ProfilesControllers')
const BraceletController = require('./controllers/BraceletsControllers')
const NursesController = require('./controllers/NursesControllers')
const PatientsController = require('./controllers/PatientsControllers')
const UsersController = require('./controllers/UsersCrontrollers')
const authMiddleware = require('./middlewares/auth')



routes.get('/users', authMiddleware, UsersController.index)
routes.post('/create', authMiddleware, UsersController.create)
routes.post('/authenticate', UsersController.authenticate)
routes.post('/forgot-password', UsersController.forgot_password)
routes.post('/reset-password', UsersController.reset_password)

routes.get('/', ProfileController.index) //web routes
routes.get('/get-profiles', authMiddleware, ProfileController.get) //web routes
routes.post('/add-profile', authMiddleware, ProfileController.create) //web routes
routes.put('/profiles/:id', authMiddleware, ProfileController.update) //web routes
routes.delete('/profiles/:id', authMiddleware, ProfileController.delete) //web routes

routes.get('/bracelets', authMiddleware, BraceletController.get) //web routes
routes.post('/add-bracelet', authMiddleware, BraceletController.create) //web routes
routes.put('/bracelets/:id', authMiddleware, BraceletController.update) //web routes
routes.delete('/bracelets/:id', authMiddleware, BraceletController.delete) //web routes

routes.get('/get-nurses', authMiddleware, NursesController.get) //web routes
routes.post('/add-nurse', authMiddleware, NursesController.create) //web routes
routes.put('/nurses/:id', authMiddleware, NursesController.update) //web routes
routes.delete('/nurses/:id', authMiddleware, NursesController.delete) //web routes

routes.get('/patients/:id', authMiddleware, PatientsController.get) //web routes
routes.post('/alert', PatientsController.create) //esp32 routes
routes.post('/test-alert', PatientsController.test_create) //esp32 routes
routes.post('/test', PatientsController.test) //esp32 test connection route
routes.delete('/patients-data/:id', authMiddleware, PatientsController.delete) //web routes
routes.post('/false-alert', PatientsController.false_alert) //esp32 test false alert route
routes.post('/false-alert-test', PatientsController.false_alert_test) //esp32 test false alert route

module.exports = routes;