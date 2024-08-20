

export const getFaq = async (req, res) => {
  try {
    res.render("faq.ejs");
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getAbout = async (req, res) => {
  try {
    res.render("about.ejs");
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


