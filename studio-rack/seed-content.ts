import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'lj9mp7qf',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // You need a write token
});

const author = {
  _type: 'author',
  _id: 'author-rack-team',
  name: 'Rack Team',
  slug: { _type: 'slug', current: 'rack-team' },
  bio: [
    {
      _type: 'block',
      _key: 'bio1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'The Rack team is dedicated to helping property managers and landlords make data-driven rental decisions across Australia.',
        },
      ],
    },
  ],
};

const categories = [
  {
    _type: 'category',
    _id: 'category-rental-market',
    title: 'Rental Market',
    slug: { _type: 'slug', current: 'rental-market' },
    description: 'Insights and analysis on the Australian rental market',
  },
  {
    _type: 'category',
    _id: 'category-property-tips',
    title: 'Property Tips',
    slug: { _type: 'slug', current: 'property-tips' },
    description: 'Practical tips for landlords and property managers',
  },
  {
    _type: 'category',
    _id: 'category-market-analysis',
    title: 'Market Analysis',
    slug: { _type: 'slug', current: 'market-analysis' },
    description: 'In-depth analysis of property market trends',
  },
];

const posts = [
  {
    _type: 'post',
    _id: 'post-understanding-rental-appraisals',
    title: 'Understanding Rental Appraisals: A Complete Guide for Australian Landlords',
    slug: { _type: 'slug', current: 'understanding-rental-appraisals-guide' },
    author: { _type: 'reference', _ref: 'author-rack-team' },
    categories: [{ _type: 'reference', _ref: 'category-rental-market', _key: 'cat1' }],
    publishedAt: new Date().toISOString(),
    excerpt: 'Learn everything you need to know about rental appraisals, from understanding market comparables to setting the right rental price for your property.',
    body: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'A rental appraisal is one of the most important tools for landlords and property managers when determining the right rental price for a property. Whether you\'re a first-time landlord or an experienced investor, understanding how rental appraisals work can help you maximise your returns while keeping your property competitive in the market.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block2',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span2',
            text: 'What is a Rental Appraisal?',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span3',
            text: 'A rental appraisal is an estimate of how much rent a property could achieve in the current market. It\'s based on comparable properties in the area, the property\'s features and condition, current market demand, and local amenities and infrastructure.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block4',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span4',
            text: 'Key Factors That Influence Rental Prices',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block5',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span5',
            marks: ['strong'],
            text: 'Location: ',
          },
          {
            _type: 'span',
            _key: 'span6',
            text: 'Proximity to public transport, schools, shops, and employment hubs significantly impacts rental value. Properties in inner-city areas typically command higher rents than those in outer suburbs.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block6',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span7',
            marks: ['strong'],
            text: 'Property Size and Configuration: ',
          },
          {
            _type: 'span',
            _key: 'span8',
            text: 'The number of bedrooms, bathrooms, and overall floor space directly affects rental potential. A 3-bedroom house will generally rent for more than a 2-bedroom unit in the same area.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block7',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span9',
            marks: ['strong'],
            text: 'Property Condition: ',
          },
          {
            _type: 'span',
            _key: 'span10',
            text: 'Well-maintained properties with modern fittings attract higher rents. Consider investing in updates like fresh paint, new flooring, or updated appliances to increase rental value.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block8',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span11',
            text: 'How Rack Can Help',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block9',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span12',
            text: 'Rack\'s rental appraisal tool uses real-time market data and advanced algorithms to provide accurate rental estimates. Our platform analyses thousands of comparable properties, recent rental listings, and market trends to give you a data-driven appraisal you can trust.',
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    _id: 'post-2024-rental-market-trends',
    title: '2024 Australian Rental Market Trends: What Landlords Need to Know',
    slug: { _type: 'slug', current: '2024-australian-rental-market-trends' },
    author: { _type: 'reference', _ref: 'author-rack-team' },
    categories: [
      { _type: 'reference', _ref: 'category-market-analysis', _key: 'cat1' },
      { _type: 'reference', _ref: 'category-rental-market', _key: 'cat2' },
    ],
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    excerpt: 'Discover the latest trends shaping the Australian rental market in 2024, including vacancy rates, rental growth, and emerging hotspots.',
    body: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'The Australian rental market continues to evolve rapidly, with significant changes in vacancy rates, rental prices, and tenant preferences. Understanding these trends is essential for landlords looking to make informed decisions about their investment properties.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block2',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span2',
            text: 'Vacancy Rates at Historic Lows',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span3',
            text: 'Across major Australian cities, vacancy rates remain near historic lows. Sydney and Melbourne are seeing rates below 1.5%, while Brisbane and Perth are even tighter at under 1%. This creates strong conditions for landlords but requires careful pricing strategies to balance returns with tenant retention.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block4',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span4',
            text: 'Regional Areas Gaining Popularity',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block5',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span5',
            text: 'The shift to remote work has made regional areas increasingly attractive to tenants. Towns like Newcastle, Geelong, and the Sunshine Coast are seeing strong rental growth as tenants seek better lifestyle and more affordable housing options outside major cities.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block6',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span6',
            text: 'Rental Price Growth',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block7',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span7',
            text: 'Annual rental growth has moderated from the peaks of 2022-2023 but remains solid. Most capital cities are seeing growth of 5-8% year-on-year, with houses outperforming units in many markets. Regional areas continue to see above-average growth as demand outpaces supply.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block8',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span8',
            text: 'Looking Ahead',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block9',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span9',
            text: 'With population growth continuing and new housing supply constrained, the rental market is expected to remain competitive through 2024 and beyond. Landlords who stay informed about market conditions and use data-driven tools like Rack will be best positioned to optimise their returns.',
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    _id: 'post-maximize-rental-yield',
    title: '5 Proven Strategies to Maximise Your Rental Yield',
    slug: { _type: 'slug', current: 'maximize-rental-yield-strategies' },
    author: { _type: 'reference', _ref: 'author-rack-team' },
    categories: [{ _type: 'reference', _ref: 'category-property-tips', _key: 'cat1' }],
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    excerpt: 'Boost your property investment returns with these five practical strategies that successful landlords use to maximise rental yield.',
    body: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'Maximising rental yield is the goal of every property investor. While location plays a significant role, there are many strategies within your control that can help boost your returns. Here are five proven approaches used by successful landlords across Australia.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block2',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span2',
            text: '1. Price Your Property Correctly from Day One',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span3',
            text: 'Overpricing leads to extended vacancies, which can cost you more than accepting a slightly lower rent. Use data-driven tools like Rack to understand your property\'s true market value and price competitively. A property that rents quickly at $550/week generates more income than one sitting empty for weeks waiting for $580.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block4',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span4',
            text: '2. Minimise Vacancy Periods',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block5',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span5',
            text: 'Every week your property sits empty is lost income you can never recover. Start marketing before your current tenant leaves, ensure the property is in show-ready condition, and respond quickly to enquiries. Consider offering flexible lease terms to attract a wider pool of tenants.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block6',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span6',
            text: '3. Make Strategic Improvements',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block7',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span7',
            text: 'Not all improvements deliver equal returns. Focus on high-impact, low-cost upgrades like fresh paint, updated light fixtures, and modern window treatments. Kitchen and bathroom updates can justify significant rent increases but calculate the payback period before investing.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block8',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span8',
            text: '4. Retain Good Tenants',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block9',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span9',
            text: 'A reliable tenant who pays on time and takes care of your property is worth their weight in gold. Consider moderate rent increases rather than pushing for maximum returns if it means keeping a good tenant. The costs of tenant turnover, including vacancy, cleaning, and re-letting fees, can quickly exceed the benefit of a higher rent.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block10',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 'span10',
            text: '5. Review Your Rent Regularly',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block11',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span11',
            text: 'Markets change, and your rent should reflect current conditions. Review your rental price at least annually using market data. If comparable properties are achieving higher rents, you may be leaving money on the table. Tools like Rack make it easy to stay on top of market rates and ensure you\'re pricing appropriately.',
          },
        ],
      },
    ],
  },
];

async function seedContent() {
  console.log('Starting content seed...');

  try {
    // Create author
    console.log('Creating author...');
    await client.createOrReplace(author);
    console.log('Author created: Rack Team');

    // Create categories
    console.log('Creating categories...');
    for (const category of categories) {
      await client.createOrReplace(category);
      console.log(`Category created: ${category.title}`);
    }

    // Create posts
    console.log('Creating posts...');
    for (const post of posts) {
      await client.createOrReplace(post);
      console.log(`Post created: ${post.title}`);
    }

    console.log('\nContent seeding complete!');
    console.log('Created:');
    console.log('- 1 author');
    console.log('- 3 categories');
    console.log('- 3 blog posts');
  } catch (error) {
    console.error('Error seeding content:', error);
    process.exit(1);
  }
}

seedContent();
