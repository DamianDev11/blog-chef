import moment from "moment/moment";
import { getFlaggedPosts } from "../../controllers/post";

export default async (req, res) => {
  try {
    const getPosts = await getFlaggedPosts();
    res.render("dashboard", {
      user: req.session.user.name,
      lastLoggedIn: moment(req.session.user.lastLoggedIn).format(
        "MMMM, Do YYYY, h:mm:ss a"
      ),
      posts: getPosts,
    });
  } catch (error) {
    res.send("There was an error rendering the page");
  }
};
