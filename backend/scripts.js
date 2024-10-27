import fs from "fs";

try {
  // Read and parse the original data from data.json
  const data = JSON.parse(fs.readFileSync("./DATA.json", "utf-8"));

  const newData = data.map((item) => {
    return {
      name: item.name,
      small_logo_thumb_url: item.small_logo_thumb_url,
      Long_description: item.long_description,
      website: item.website,
      all_locations: item.all_locations,
      one_liner: item.one_liner,
    };
  });

  // Write the new data to data-min.json
  fs.writeFileSync("./miniData.json", JSON.stringify(newData, null, 2));

  console.log("New .json file created successfully!");
} catch (err) {
  console.error("Error processing the files:", err);
}
