'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { ArrowDown, ArrowUp } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import Image from "next/image";

export default function Home() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [newsArticles, setNewsArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Top")

  // Categories mapping - UI name to backend value
  const categories = [
    { name: "Top", value: "top" },
    { name: "Tech & Science", value: "techsci" },
    { name: "Finance", value: "finance" },
    { name: "Arts & Culture", value: "artcul" }
  ]

  // Fetch news data from the API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('http://localhost:8080/articles')
        const data = await response.json()
        setNewsArticles(data)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Rotating Placeholder Logic
  const placeholders = [
    'Find news about...',
    'e.g. Global Warming',
    'What\'s trending today?',
    'Politics, Tech, Health...',
    'Stay informed in seconds',
  ];
  
  // Typewriter effect state
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 1; // Made constant

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPlaceholder = placeholders[placeholderIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentPlaceholder.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        
        if (charIndex === 0) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      }, typingSpeed / 2);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentPlaceholder.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        
        if (charIndex === currentPlaceholder.length) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [charIndex, placeholderIndex, isDeleting]);

  const handleSearch = () => {
    if (!topic.trim()) return;
    router.push(`/search?query=${encodeURIComponent(topic)}`);
  };

  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName)
  }

  // Get the current category value based on UI name
  const getCurrentCategoryValue = () => {
    const categoryObj = categories.find(cat => cat.name === activeCategory)
    return categoryObj ? categoryObj.value : "top"
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      {/* Top Branding */}
      <header className="w-full p-4 flex justify-center items-center pt-12">
        <img
          src="CLARITY.png"
          alt="logo"
          width={150}
          height={150}
        />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start px-4 text-center pt-40">
        <p className="text-gray-400 mb-4 text-2xl">
          World news just a search away...
        </p>

        {/* Search Input */}
        <div className="w-full max-w-md">
      <div className="flex items-center bg-[#2b2b2b] border border-white/20 rounded-full px-4 py-1 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
        <input
          type="text"
          placeholder={displayText}
          className="bg-transparent outline-none text-gray-100 w-full placeholder-gray-400"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
    </div>
        
        {/* Cards */}
        <div className="flex flex-wrap gap-2 bg-black p-4 items-center justify-center text-white">
          {/* Card 1 */}
          <div
            className="bg-[#1c1c1e] rounded-xl px-3 py-2 w-40 flex items-center gap-1 cursor-pointer hover:bg-gray-800 transition"
            onClick={() => router.push('/search?query=Trump reclassifies 50,000 federal worker...')}
          >
            <div className="w-10 h-10 rounded-md shrink-0 overflow-hidden">
              <Image
                src="/donald.png"
                alt="Donald Trump"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-sm leading-tight line-clamp-2">
              Trump reclassifies 50,000 federal worker...
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="bg-[#1c1c1e] rounded-xl px-3 py-2 w-40 flex items-center gap-1 cursor-pointer hover:bg-gray-800 transition"
            onClick={() => router.push('/search?query=elon musk says AI will transform humanity...')}
          >
            <div className="w-10 h-10 rounded-md shrink-0 overflow-hidden">
              <Image
                src="/elon.png"
                alt="elon musk"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-sm leading-tight line-clamp-2">
            Elon Musk says AI will transform humanity...
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="bg-[#1c1c1e] rounded-xl px-3 py-2 w-40 flex items-center gap-3 cursor-pointer hover:bg-gray-800 transition"
            onClick={() => console.log("Card 3 clicked")}
          >
            <div className="w-10 h-10 bg-gray-700 rounded-md shrink-0 flex items-center justify-center">
              <span className="text-sm font-medium">Dow</span>
            </div>
            <div>
              <span className="text-sm font-medium block">39,142.23</span>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <ArrowDown size={12} /> -1.33%
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div
            className="bg-[#1c1c1e] rounded-xl px-3 py-2 w-40 flex items-center gap-3 cursor-pointer hover:bg-gray-800 transition"
            onClick={() => console.log("Card 4 clicked")}
          >
            <div className="w-10 h-10 bg-gray-700 rounded-md shrink-0 flex items-center justify-center">
              <span className="text-sm font-medium">AAPL</span>
            </div>
            <div>
              <span className="text-sm font-medium block">196.98</span>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <ArrowUp size={12} /> +1.39%
              </div>
            </div>
          </div>
        </div>

        {/* Drawer */}
        <div className="mt-4 flex gap-4">
          <Drawer>
            <DrawerTrigger asChild>
            <div className="flex flex-col items-center">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white text-xl transition duration-200 font-medium hover:cursor-pointer">
                <FontAwesomeIcon icon={faGlobe} className="text-2xl" />
                <span>E X P L O R E</span>
              </button>
            </div>
            </DrawerTrigger>

            <DrawerContent className="bg-black border-t border-gray-800 h-[80vh] overflow-hidden rounded-t-2xl transition-all duration-300">
              {/* Visually Hidden Title for Accessibility */}
              <DrawerTitle className="sr-only">Discover News</DrawerTitle>

              {/* Visible Header */}
              <div className="text-center py-6">
                <h3 className="text-xl font-semibold text-white">Discover News</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Explore trending and unbiased news summaries.
                </p>
              </div>

              {/* Category Navigation */}
              <div className="w-full px-4">
                <div className="flex justify-center items-center space-x-6 overflow-x-auto scrollbar-hide pb-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                        category.name === activeCategory ? "text-white" : "text-gray-400"
                      } hover:text-white`}
                      onClick={() => handleCategoryChange(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Vertical Scrollable Cards */}
                <div className="flex justify-center">
                  <div className="w-full max-w-xl h-[50vh] overflow-y-auto custom-scroll">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 p-4">
                        {newsArticles.filter(article => {
                          const currentCategory = getCurrentCategoryValue()
                          return currentCategory === "top" || 
                                article.category === currentCategory
                        }).map((article) => (
                          <div
                            key={article.id}
                            className="h-48 rounded-xl bg-gray-900 border border-gray-800 flex flex-col overflow-hidden cursor-pointer hover:border-blue-500 transition"
                            onClick={() => router.push(`/search?query=${article.title}`)}
                          >
                            <div className="h-28 w-full overflow-hidden relative">
                              <img 
                                src={article.img_url}
                                alt="Article Image"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-2 flex-grow flex items-center">
                              <p className="text-sm leading-tight text-white line-clamp-2">
                                {article.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DrawerFooter className="px-4">
                <DrawerClose asChild>
                  {/* Close button if needed */}
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        
      </main>
    </div>
  )
}