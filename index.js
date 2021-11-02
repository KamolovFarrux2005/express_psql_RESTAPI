import express from 'express';
// import cors from 'cors'
import pool from './db.js'
const  app  = express();
const port = process.env.PORT || 5000;
// const corsOptions = {origin: process.env.URL || '*'}
// app.use(cors(corsOptions));
app.use(express.json());
app.get('/' , async(req , res)=>{
try {
   const user = await pool.query('SELECT * FROM users')
    res.json(user);
} catch (error) {
   console.log(error.message);
}
   
});
app.get('/email' , async(req , res)=>{
   try {
      const user = await pool.query("SELECT * FROM users WHERE email LIKE '%mail.ru' ")
       res.json(user);
   } catch (error) {
      console.log(error.message);
}
});

app.get('/:name' , async(req , res)=>{
   try{
      const { name } = req.params
      const user = await pool.query(`SELECT * FROM users WHERE first_name= $1`, [name])
       res.json(user.rows);
   } catch (error) {
      console.log(error.message);
}
});

app.post('/create', async(req,res)=>{
   try{
      const {id,first_name, last_name, email, gender, date_of_birthday} = req.body;
      const newPost = await pool.query("INSERT INTO users (id, first_name, last_name, email, gender, date_of_birthday) VALUES($1, $2, $3, $4, $5, $6)", [id,first_name, last_name, email, gender, date_of_birthday]);
      res.json(newPost.rows[0]);
   }catch(err){
      console.log(err.message)
   }
});

app.put('/users/:id' , async(req , res)=>{
   try{
      const {id} = req.params;
      const {first_name,last_name, email, gender, date_of_birthday} = req.body;
      const updateUser = await pool.query("UPDATE users SET  first_name=$1,   last_name=$2,   email=$3, gender=$4, date_of_birthday=$5 WHERE id=$6", [first_name, last_name, email, gender, date_of_birthday, id]);
       res.json(`user updated ${id}`);
   }catch(err){
      console.log(err.message);
   }

})
      
app.delete('/delete/:id', async(req, res) => {
   const {id} = req.params;
    await pool.query("DELETE FROM users WHERE id=$1", [id])
    res.json('deleted');
});





app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))