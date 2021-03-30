

//keys variables
const keys = require('./keys');


//project variables
const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');


//store variables
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session);
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})


//middlewares variables
const csrf = require('csurf');
const flash = require('connect-flash');


//custom middlewares variables
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const fileMiddleware = require('./middleware/file');
const errorHandling = require('./middleware/error');


//routes variables
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');


//engine variables
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
})

//--------------------------------------------------------------------------------------------------------------------//


//set engine and static folder
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));


//connect session and middlewares
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives:{
        defaultSrc: ["'self'"],
        scriptSrc:["'self'",'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',],
        styleSrc: ["'self'", 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'],
        imgSrc: ["'self'", '*']}}));
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);


//register routes
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);


//404 error
app.use(errorHandling);




async function start() {
    try {

        //connection to mongoDB
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        //starting server
        app.listen(keys.PORT, () => {
            console.log(`Server has been started on port ${keys.PORT} ...`);
        });
    } catch (e) {

        //logging error
        console.log(e)
    }
}


//starting project
start()





