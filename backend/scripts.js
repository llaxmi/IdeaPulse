import fs from "fs";

try {
  // Read and parse the original data from data.json
  const data = JSON.parse(fs.readFileSync("./dataa.json", "utf-8"));

  const newData = data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      small_logo_thumb_url: item.small_logo_thumb_url,
      website: item.website,
      all_locations: item.all_locations,
      one_liner: item.one_liner,
    };
  });

  // Write the new data to data-min.json
  fs.writeFileSync("./minData.json", JSON.stringify(newData, null, 2));

  console.log("New .json file created successfully!");
} catch (err) {
  console.error("Error processing the files:", err);
}
