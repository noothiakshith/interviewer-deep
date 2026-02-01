import axios from "axios";

export const main = async () => {
  try {
    const response = await axios.get(
      "https://api.github.com/users/noothiakshith/repos"
    )

    console.log(response);
  } catch (err) {
    console.error("Error fetching repos:", err);
  }
};

main();