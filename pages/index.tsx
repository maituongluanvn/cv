// import * as md from '../src/index.md';
import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { FileContent } from '../schemas/cv';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Container from '@mui/material/Container';
function Index({ cv }: { cv: FileContent }) {
  return (
    <Container maxWidth="lg" fixed>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
        <Grid justifyContent="center" xs={12}>
          <div dangerouslySetInnerHTML={{ __html: marked(cv.content) }}></div>
        </Grid>
        <Grid justifyContent="center" item xs={12}>
          asd
        </Grid>
      </Stack>
    </Container>
  );
}

export async function getStaticProps() {
  // Get files from the posts dir
  const files = fs.readdirSync(path.join('posts'));
  // Get slug and frontmatter
  const cv = files.map((filename) => {
    const slug = filename.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8');
    const { data: frontmatter, content } = matter(markdownWithMeta);
    return {
      slug,
      frontmatter,
      content,
    };
  });

  return {
    props: {
      cv: cv[0],
    },
  };
}

export default Index;
