import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';

// Use Vite's import.meta.glob to load all markdown files
const markdownFiles = import.meta.glob('./markdown/*.md', { eager: true });

// Parse the files using gray-matter to extract frontmatter and content
const parsedMarkdownFiles = Object.keys(markdownFiles).map((key) => {
  const fileContent = markdownFiles[key] as { default: string };
  const { data, content } = matter(fileContent.default); // Extract frontmatter and content
  return {
    fileName: key,
    title: data.title,
    date: new Date(data.date), // convert string to Date object
    category: data.category,
    content: content,
  };
});

// Sort markdown files by date (newest first)
parsedMarkdownFiles.sort((a, b) => b.date.getTime() - a.date.getTime());

const Updates: React.FC = () => {
  // State for pagination, search, and category filter
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const itemsPerPage = 5;

  // Filter files based on search query and selected category
  const filteredFiles = parsedMarkdownFiles.filter((file) => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

  return (
    <div
      style={{
        position: 'absolute',
        background: 'red',
        height: '400px',
        width: '400px',
        // zIndex: 14,
      }}
    >
      <h1>Site Updates</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search updates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Release Notes">Release Notes</option>
        <option value="Events">Events</option>
        <option value="Announcements">Announcements</option>
        {/* Add more categories as needed */}
      </select>

      {/* News Updates List */}
      <div>
        {paginatedFiles.map((file, index) => (
          <div key={index}>
            <h2>
              {file.title} ({file.date.toLocaleDateString()})
            </h2>
            <ReactMarkdown>{file.content}</ReactMarkdown>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Updates;
