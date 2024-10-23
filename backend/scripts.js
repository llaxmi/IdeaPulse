import fs from "fs";

try {
  // Read and parse the original data from data.json
  const data = JSON.parse(fs.readFileSync("./data2.json", "utf-8"));

  const newData = data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      small_logo_thumb_url: item.small_logo_thumb_url,
      website: item.website,
      all_locations: item.all_locations,
      long_description: item.long_description,
      one_liner: item.one_liner,
    };
  });

  // Write the new data to data-min.json
  fs.writeFileSync("./data.json", JSON.stringify(newData, null, 2));

  console.log("New data-min.json file created successfully!");
} catch (err) {
  console.error("Error processing the files:", err);
}
