import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import ProjectList from "../components/projects/ProjectList";

const HomePage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  return (
    <Layout>
      <Hero onSearch={setSearchKeyword} />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {searchKeyword
            ? `Search Results: "${searchKeyword}"`
            : "Latest Projects"}
        </h2>
        <ProjectList keyword={searchKeyword} />
      </section>
    </Layout>
  );
};

export default HomePage;
