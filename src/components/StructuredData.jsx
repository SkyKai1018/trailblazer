import { Helmet } from 'react-helmet-async'

export default function StructuredData({ shoe, productData }) {
  if (!shoe) return null

  const brand = productData?.product_identity?.brand || shoe.brand
  const modelName = productData?.product_identity?.model_name || shoe.name
  const summary = productData?.marketing_copy?.one_sentence_summary || shoe.short_desc || ''
  const image = shoe.cover_image_url || shoe.image_url
  const priceInfo = productData?.product_identity?.price_info
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${brand} ${modelName}`,
    "description": summary,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": productData?.product_identity?.category || "越野跑鞋",
  }

  // 如果有價格資訊，添加 offers
  if (priceInfo) {
    structuredData.offers = {
      "@type": "Offer",
      "priceCurrency": priceInfo.currency || "TWD",
      "price": priceInfo.twd_approx?.regular || priceInfo.msrp || "",
      "availability": "https://schema.org/InStock"
    }
  }

  // 如果有性能分析，添加 aggregateRating
  const performanceData = productData?.performance_analysis
  if (performanceData) {
    const scores = Object.values(performanceData)
      .filter(item => item?.score)
      .map(item => item.score)
    
    if (scores.length > 0) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
      structuredData.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": (avgScore / 10 * 5).toFixed(1), // 轉換為 5 星制
        "reviewCount": "1"
      }
    }
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

