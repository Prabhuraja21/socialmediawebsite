//const { text } = require("express");
const Post = require("../models/Post");
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVOAPIKEY; // Your Brevo API key


exports.viewCreateScreen = function (req, res) {
  res.render("create-post");
};

exports.create = async function (req, res) {
  let post = new Post(req.body, req.session.user._id);
  try{
    const newId = await post.create()
    req.flash("success", "New post successfully created.");
    req.session.save(() => res.redirect(`/post/${newId}`))
    }catch(e){
    e.forEach((error)=> req.flash("errors", error))
    req.session.save(() => res.redirect("/create-post"))
    }
}
//   post
//     .create()
//     .then(function (newId) {
//       // Email details
//       const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
//       const sendSmtpEmail = {
//         to: [{ email: 'prabhusumathi21@gmail.com', name: 'Prabhu' }],
//         sender: { email: 'prabhurajagr@gmail.com', name: 'Test Sender' },
//         subject: 'Congrats on creating a new post',
//         textContent: 'You did a great job of creating a post.',
//         htmlContent: 'You did a <strong>great</strong> job of creating a post.',
//       };
//       // Send the email
//       apiInstance.sendTransacEmail(sendSmtpEmail).then(
//         function (data) {
//           console.log('Email sent successfully:', data);
//           req.flash("success", "New post successfully created.");
//           req.session.save(() => res.redirect(`/post/${newId}`));
//         },
//         function (error) {
//           console.error('Error sending email:', error.response ? error.response.body : error);
//           req.flash("errors", "Failed to send email. Please try again.");
//           req.session.save(() => res.redirect("/create-post"));
//         }
//       );
//     })
//     .catch(function (error) {
//       console.error('Error creating post:', error);
//       req.flash("errors", error.message || "An unexpected error occurred.");
//       req.session.save(() => res.redirect("/create-post"));
//     });
// };
     
exports.apiCreate = async function (req, res) {
  let post = new Post(req.body, req.apiUser._id);
  try{
    const newId = await post.create()
    res.json("Congrats")
  }catch(e){
    res.json(e)
  }
};

exports.viewSingle = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId);
    res.render("single-post-screen", { post: post, title: post.title });
  } catch {
    res.render("404.ejs");
  }
};

exports.viewEditScreen = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId);
    if(post.isVisitorOwner){
      res.render("edit-post", { post: post });
    }else{
      req.flash("errors", "You do not have permission to perform that action.")
      req.session.save(() => res.redirect("/"))
    }
  } catch {
    res.render("404");
  }
};

exports.edit = async function (req, res) {
  let post = new Post(req.body, req.visitorId, req.params.id);
  try{
    const status = await post.update()
     // the post was successfully updated in the database
    //or user did have permission, but there were validation errors
    if(status == "success"){
      // post was updated in db
      req.flash("success", "Post successfully updated.")
      req.session.save(function(){
        res.redirect(`/post/${req.params.id}/edit`)
      })

    }else{
      post.errors.forEach(function (error){
        req.flash("errors", error)
      })
      req.session.save(function(){
        res.redirect(`/post/${req.params.id}/edit`)
      })
    }
  }catch(e){
     // a post with the requested id doesn't exist
    // or if the current visitor is not the owner of the requested post
    req.flash("errors", 'You do not have permission to perfom that action.')
    req.session.save(function(){
      res.redirect('/')
  })
  }
}

exports.delete = async function (req, res) {
  try{
    await Post.delete(req.params.id, req.visitorId)
    req.flash("success", "Post successfully deleted.")
    req.session.save(() => res.redirect(`/profile/${req.session.user.username}`)) 
  }catch(e){  
    req.flash("errors", "You do not have permission to perform that action.")
    req.session.save(() => res.redirect("/"))
  }
}

exports.apiDelete = async function (req, res) {
  try{
    await Post.delete(req.params.id, req.apiUser._id)
    res.json('Success')
  }catch(e){
    res.json('You do not have permission to perform that action.')
  }
}

exports.search = async function (req, res) {
  try{
    const posts = await Post.search(req.body.searchTerm)
    res.json(posts)
  }catch(e){
    res.json([])
  }
}