const app = document.getElementById("app");

const fetchRecommendations = async () => {
  const userId = document.getElementById("userId").value.trim();

  if (!userId) {
    alert("Please enter a user ID");
    return;
  }

  const url = `https://smart-closet.onrender.com/recommendations?user_id=${userId}`;
  app.innerHTML = "<p>Loading recommendations...</p>";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    const data = await response.json();
    displayRecommendations(data);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    app.innerHTML = "<p>Failed to fetch recommendations. Displaying sample data.</p>";
    loadSampleData();
  }
};

const displayRecommendations = (data) => {
  app.innerHTML = `
    <div>
      <h2>Best Selling Items</h2>
      <p>${data.explanation.best_selling_items}</p>
      <div class="card-container">
        ${data.best_selling_items
          .map(
            (item) => {
              // Generate image filename by removing spaces and appending '.jfif'
              const imageName = item.item_id + ".jfif";
              return `
                <div class="card best-selling-card">
                  <h3>${item.description}</h3>
                  <img src="${imageName}" alt="${item.description}" class="product-image" />
                  <p>Sales: ${item.sales}</p>
                  <button class="buy-button" onclick="buyItem('${item.item_id}', '${item.description}')">Buy</button>
                </div>
              `;
            }
          )
          .join("")}
      </div>
    </div>

    <div>
      <h2>Discounted Items</h2>
      <p>${data.explanation.discounted_items}</p>
      <div class="card-container">
        ${data.discounted_items
          .map(
            (item) => {
              const imageName = item.item_id + ".jfif";
              return `
                <div class="card discounted-card">
                  <h3>${item.description}</h3>
                  <img src="${imageName}" alt="${item.description}" class="product-image" />
                  <p>Discount: ${item.discount}%</p>
                  <button class="buy-button" onclick="buyItem('${item.item_id}', '${item.description}')">Buy</button>
                </div>
              `;
            }
          )
          .join("")}
      </div>
    </div>

    <div>
      <h2>Personalized Recommendations</h2>
      <p>${data.explanation.personalized_recommendations}</p>
      <div class="card-container">
        ${data.personalized_recommendations.recommended_items
          .map(
            (item) => {
              const imageName = item.item_id + ".jfif";
              return `
                <div class="card personalized-card">
                  <h3>${item.description}</h3>
                  <img src="${imageName}" alt="${item.description}" class="product-image" />
                  <p>Reason: ${item.reason}</p>
                  <button class="buy-button" onclick="buyItem('${item.item_id}', '${item.description}')">Buy</button>
                </div>
              `;
            }
          )
          .join("")}
      </div>
    </div>
  `;
};

const loadSampleData = () => {
  const sampleData = {
    best_selling_items: [
      { description: "Sports Pants by MastekWear", item_id: "I22", sales: 192 },
      { description: "Formal Pants by MastekWear", item_id: "I44", sales: 198 },
    ],
    discounted_items: [
      { description: "Sports Jacket by MastekWear", discount: 50, item_id: "I36" },
      { description: "Ethnic Jacket by MastekWear", discount: 50, item_id: "I8" },
    ],
    explanation: {
      best_selling_items: "These items have the highest sales in the store.",
      discounted_items: "These items have the highest discounts currently available.",
      personalized_recommendations: "These are based on your past interactions.",
    },
    personalized_recommendations: {
      recommended_items: [
        { description: "Formal Pants by MastekWear", reason: "Previously Added to Cart" },
        { description: "Casual Pants by MastekWear", reason: "Previously Added to Cart" },
      ],
    },
  };

  displayRecommendations(sampleData);
};

const buyItem = (itemId, description) => {
  alert(`Item "${description}" with ID "${itemId}" added to your cart!`);
};

document.getElementById("fetchButton").addEventListener("click", fetchRecommendations);
