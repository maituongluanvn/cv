// import * as md from '../src/index.md';
import Markdown from 'markdown-to-jsx';
import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const md = `
# Hello world
`;
function Index({ posts }) {
  console.log('🚀 ~ Index ~ posts', posts);
  return (
    <Markdown
      children={md}
      options={{
        overrides: {},
      }}
    />
  );
}

export async function getStaticProps() {
  // Get files from the posts dir
  const files = fs.readdirSync(path.join('posts'));

  // Get slug and frontmatter from posts
  const posts = files.map((filename) => {
    // Create slug
    const slug = filename.replace('.md', '');

    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8');

    const { data: frontmatter } = matter(markdownWithMeta);

    return {
      slug,
      frontmatter,
    };
  });

  console.log('🚀 ~ getStaticProps ~ posts', posts);
  return {
    props: {
      posts: posts,
    },
  };
}

export default Index;
