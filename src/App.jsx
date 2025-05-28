import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PostDetail from "./components/PostDetail";
import PostItem from "./components/PostItem";
import PostsList from "./features/posts/PostsList";
import CategoriesFilter from "./components/CategoriesFilter";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PostsList />} />
        <Route path="/post/:subreddit/:postId" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
