const express  = require("express")
const mongoose = require("mongoose")

const app = express();

const connect = ()=>{
    return mongoose.connect("mongodb+srv://fahadalim:fahadalim@cluster0.5se3m.mongodb.net/trial?retryWrites=true&w=majority")
};

//creating Sectionschema
const sectionSchema = new mongoose.Schema({
    sectionName :{type:String,required:true}
});

const Section = mongoose.model("section",sectionSchema);

//book schema
const bookSchema = new mongoose.Schema({
    bookName:{type:String,required:true},
    sectionName:{type:mongoose.Schema.Types.ObjectId,ref:"Section"}
});

const Book = mongoose.model("book",bookSchema);

//authorschema

const authorschema = new mongoose.Schema({
    authorName:{type:String,required:true},
});

const Author = mongoose.model("author",authorschema);

// Create schema for book author

const bookAuthorSchema = new mongoose.Schema({
    book_id:{type : mongoose.Schema.Types.ObjectId, ref:"book", required:true},
    author_id:[{type : mongoose.Schema.Types.ObjectId, ref:"author", required:true}]
})

const BookAuthor = mongoose.model("bookAuthor", bookAuthorSchema)


//Crud operation

//crud api for section

app.get("/section", async (req,res)=>{
    try{
        const sec= await Section.find().lean().exec();
        res.status(200).send({sec})
    }
    catch(err){
        console.log(err.message)
    };
});


app.post("/section", async (req,res)=>{
    try{
        const sec= await Section.create(req.body);
        res.status(201).send({sec})
    }
    catch(err){
        console.log(err.message)
    };
});

//crud api for books

app.post("/books", async(req,res)=>{
    try{
        const book = await Book.create(req.body)
        res.status(201).send({sec})
    }
    catch(err){
        console.log(err.message)
    }
});

app.get("/books", async(req,res)=>{
    try{
        const book = await Book.find().lean().exec();
        res.status(201).send({sec})
    }
    catch(err){
        console.log(err.message)
    }
});

app.get("/books/:id", async(req,res)=>{
    try{
        const book = await Book.findById(req.params.id).lean().exec();
        res.status(201).send({sec})
    }
    catch(err){
        console.log(err.message)
    }
});

//----------------CRUD API for Authors-----------------------


app.post("/author", async (req, res)=>{
    const author = await Author.create(req.body)

    return res.status(201).send({author})
});

app.get("/author", async (req,res)=>{
    const author = await Author.find().lean().exec();
    res.status(200).send({author})
});


//----------------CRUD API for bookAuthor-----------------------

app.post("/bookauthor", async(req,res)=>{
    const bookauthor = await BookAuthor.create(req.body);
    return res.status(201).send({bookauthor})
})
app.get("/bookauthor", async (req,res)=>{
    const bookauthor = await BookAuthor.find().populate("author_id").populate("book_id").lean().exec();
    res.status(200).send({bookauthor})
});



// All books written by an Author

app.get("/booksbyauthor/:id", async(req, res)=>{
    const match = await BookAuthor.find({author_id:req.params.id}).lean().populate("book_id").exec();
    res.send(match)
})




app.listen(5000,async()=>{
    try{
        await connect()
    }
    catch(err){
        console.log(err.message)
    }
    console.log("listening")
})