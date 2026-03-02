import React, { useState, useEffect, useRef } from 'react';
import { 
  MonitorPlay, Download, FileText, Plus, Trash2, ChevronLeft, ChevronRight,
  LayoutTemplate, Type, AlignLeft, X, Sparkles, Layers, Image as ImageIcon,
  Edit2, Copy, Video, Palette, Wand2, Upload, Link as LinkIcon,
  Bold, Italic, Underline, AlignCenter, AlignRight, AlignJustify,
  Scissors, ClipboardPaste, Table, Shapes, Box, PieChart, PlaySquare,
  Mic, ScreenShare, CheckCircle, Globe, MessageSquare, LayoutGrid, Maximize,
  List, Sliders, Presentation, FileVideo, Menu, Settings2
} from 'lucide-react';

// Pre-defined color palettes for slide backgrounds
const COLOR_PALETTE = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#0f172a', 
  '#eff6ff', '#e0e7ff', '#fdf4ff', '#f0fdf4', '#fffbeb'
];

const LANGUAGES = [
  "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bengali", "Bosnian", "Bulgarian", "Catalan", "Cebuano", "Chichewa", "Chinese (Simplified)", "Chinese (Traditional)", "Corsican", "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Filipino", "Finnish", "French", "Frisian", "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Kinyarwanda", "Korean", "Kurdish", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian", "Myanmar (Burmese)", "Nepali", "Norwegian", "Odia (Oriya)", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi", "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen", "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
];

export default function App() {
  const [slides, setSlides] = useState([
    { 
      id: 1, type: 'title', title: 'Project Phoenix', subtitle: 'Revolutionizing the Future of Cloud Computing', content: '',
      bgColor: '#ffffff', transition: 'fade', animation: 'none', image: null, video: null,
      textAlign: 'center', isBold: false, isItalic: false, isUnderline: false
    },
    { 
      id: 2, type: 'content', title: 'The Problem', subtitle: '', content: 'Current infrastructure is too rigid, making scaling an expensive and slow process for mid-sized enterprises.',
      bgColor: '#ffffff', transition: 'push', animation: 'fade', image: null, video: null,
      textAlign: 'left', isBold: false, isItalic: false, isUnderline: false
    },
    { 
      id: 3, type: 'split', title: 'Our Solution', subtitle: '', content: 'An adaptive, AI-driven scaling model that anticipates traffic spikes and provisions resources in milliseconds.',
      bgColor: '#f1f5f9', transition: 'fade', animation: 'fly-in', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', video: null,
      textAlign: 'left', isBold: false, isItalic: false, isUnderline: false
    }
  ]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isPptxLoaded, setIsPptxLoaded] = useState(false);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);
  
  // New States for Advanced UI
  const [activePropertyTab, setActivePropertyTab] = useState('Home'); 
  const [viewMode, setViewMode] = useState('Normal'); // 'Normal' or 'SlideSorter'

  // Loading Screen States
  const [showLoading, setShowLoading] = useState(true);
  const [loadingOpacity, setLoadingOpacity] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing PitchPro...');

  // Mobile Responsiveness States
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // AI Features States
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- FIX: Force Tailwind CDN & Override Vite CSS ---
  useEffect(() => {
    // Inject Tailwind CSS via CDN to instantly fix broken local styles
    const tailwindScript = document.createElement('script');
    tailwindScript.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tailwindScript);

    const style = document.createElement('style');
    style.innerHTML = `
      /* OVERRIDE DEFAULT VITE CSS THAT BREAKS THE LAYOUT */
      body { 
        display: block !important; 
        margin: 0 !important; 
        padding: 0 !important; 
        min-height: auto !important; 
        background-color: transparent !important;
      }
      #root { 
        max-width: none !important; 
        margin: 0 !important; 
        padding: 0 !important; 
        text-align: left !important; 
        height: 100vh; 
        display: flex; 
        flex-direction: column; 
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      if (document.head.contains(tailwindScript)) {
        document.head.removeChild(tailwindScript);
      }
    };
  }, []);

  // Load PPTX and PDF libraries dynamically
  useEffect(() => {
    const scriptPptx = document.createElement('script');
    scriptPptx.src = "https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js";
    scriptPptx.async = true;
    scriptPptx.onload = () => setIsPptxLoaded(true);
    document.body.appendChild(scriptPptx);

    const scriptPdf = document.createElement('script');
    scriptPdf.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    scriptPdf.async = true;
    scriptPdf.onload = () => setIsPdfLoaded(true);
    document.body.appendChild(scriptPdf);

    return () => {
      document.body.removeChild(scriptPptx);
      document.body.removeChild(scriptPdf);
    };
  }, []);

  // Loading Screen Sequence Simulation
  useEffect(() => {
    const t1 = setTimeout(() => { setLoadingProgress(35); setLoadingText('Loading premium layouts...'); }, 800);
    const t2 = setTimeout(() => { setLoadingProgress(75); setLoadingText('Warming up render engine...'); }, 1600);
    const t3 = setTimeout(() => { setLoadingProgress(100); setLoadingText('Workspace ready!'); }, 2400);
    const t4 = setTimeout(() => { setLoadingOpacity(0); }, 3000); // Trigger fade out
    const t5 = setTimeout(() => { setShowLoading(false); }, 3500); // Remove from DOM
    
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPresenting) return;
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 'Escape') setIsPresenting(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, currentSlideIndex]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const nextSlide = () => currentSlideIndex < slides.length - 1 && setCurrentSlideIndex(prev => prev + 1);
  const prevSlide = () => currentSlideIndex > 0 && setCurrentSlideIndex(prev => prev - 1);

  const addSlide = (layout = 'content') => {
    const newSlide = {
      id: Date.now(), type: layout, title: 'New Slide', subtitle: '', content: 'Click to edit content...',
      bgColor: '#ffffff', transition: 'fade', animation: 'none', image: null, video: null,
      textAlign: 'left', isBold: false, isItalic: false, isUnderline: false
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
    setViewMode('Normal');
    if(window.innerWidth < 1024) { setShowLeftPanel(false); setShowRightPanel(false); }
  };

  const deleteSlide = (e, index) => {
    if(e) e.stopPropagation();
    if (slides.length === 1) return showToast("You must have at least one slide.");
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlideIndex >= newSlides.length) setCurrentSlideIndex(newSlides.length - 1);
    else if (currentSlideIndex === index) setCurrentSlideIndex(Math.max(0, index - 1));
  };

  const duplicateSlide = (e, index) => {
    if(e) e.stopPropagation();
    const newSlide = { ...slides[index], id: Date.now() };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(index + 1);
    showToast("Slide duplicated!");
    if(window.innerWidth < 1024) setShowLeftPanel(false);
  };

  const updateCurrentSlide = (field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex][field] = value;
    setSlides(updatedSlides);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCurrentSlide('image', reader.result);
        updateCurrentSlide('video', null);
        showToast("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const performGeminiTask = async (task, currentSlide, targetLang = "") => {
    const apiKey = "";
    let promptText = "";
    
    const textData = JSON.stringify({
      title: currentSlide.title || "",
      subtitle: currentSlide.subtitle || "",
      content: currentSlide.content || ""
    });

    if (task === "grammar") {
      promptText = `Fix any spelling and grammar mistakes in the following text data. Maintain the original meaning. Text data: ${textData}`;
    } else {
      promptText = `Translate the following text data into ${targetLang}. Text data: ${textData}`;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            subtitle: { type: "STRING" },
            content: { type: "STRING" }
          }
        }
      }
    };

    let delay = 1000;
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        return JSON.parse(data.candidates[0].content.parts[0].text);
      } catch (err) {
        if (i === 4) throw err;
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      }
    }
  };

  const handleSpellCheck = async () => {
    setIsCheckingGrammar(true);
    showToast("Checking spelling and grammar...");
    try {
      const corrected = await performGeminiTask("grammar", slides[currentSlideIndex]);
      if (corrected) {
         if (corrected.title) updateCurrentSlide('title', corrected.title);
         if (corrected.subtitle !== undefined) updateCurrentSlide('subtitle', corrected.subtitle);
         if (corrected.content) updateCurrentSlide('content', corrected.content);
         showToast("Spelling & Grammar checked and fixed!");
      }
    } catch(e) {
      showToast("Failed to check grammar. Please try again.");
    }
    setIsCheckingGrammar(false);
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    showToast(`Translating to ${targetLanguage}...`);
    try {
      const translated = await performGeminiTask("translate", slides[currentSlideIndex], targetLanguage);
      if (translated) {
         if (translated.title) updateCurrentSlide('title', translated.title);
         if (translated.subtitle !== undefined) updateCurrentSlide('subtitle', translated.subtitle);
         if (translated.content) updateCurrentSlide('content', translated.content);
         showToast(`Slide translated to ${targetLanguage}!`);
      }
    } catch(e) {
      showToast("Translation failed. Please try again.");
    }
    setIsTranslating(false);
  };

  const exportPDF = async () => {
    if (!isPdfLoaded || typeof window.html2pdf === 'undefined') {
      showToast("PDF exporter is loading. Please wait...");
      return;
    }

    showToast("Generating high-quality PDF...");
    
    const element = document.getElementById('pdf-export-container');
    
    // Temporarily reveal for rendering
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.zIndex = '-1000';
    
    const opt = {
      margin:       0,
      filename:     'PitchPro_Presentation.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 1920, windowHeight: 1080 },
      jsPDF:        { unit: 'px', format: [1920, 1080], orientation: 'landscape' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };

    try {
      await window.html2pdf().set(opt).from(element).save();
      showToast("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error generating PDF.");
    } finally {
      element.style.display = 'none';
    }
  };

  const exportPPTX = () => {
    if (!isPptxLoaded || typeof window.PptxGenJS === 'undefined') return showToast("PowerPoint exporter loading...");
    try {
      showToast("Generating PowerPoint file...");
      const pres = new window.PptxGenJS();
      pres.layout = 'LAYOUT_16x9';

      slides.forEach(slide => {
        let slidePpt = pres.addSlide();
        slidePpt.background = { color: slide.bgColor.replace('#', '') };

        const isDarkBg = slide.bgColor === '#0f172a';
        const primaryTextColor = isDarkBg ? "FFFFFF" : "0F172A";
        const secondaryTextColor = isDarkBg ? "94A3B8" : "334155";
        const lineColor = isDarkBg ? "334155" : "E2E8F0";

        if (slide.type === 'title') {
          slidePpt.addText(slide.title, { x: "10%", y: "40%", w: "80%", fontSize: 48, bold: true, color: primaryTextColor, align: "center" });
          if (slide.subtitle) slidePpt.addText(slide.subtitle, { x: "10%", y: "55%", w: "80%", fontSize: 24, color: secondaryTextColor, align: "center" });
        } else if (slide.type === 'content') {
          slidePpt.addText(slide.title, { x: "6%", y: "8%", w: "88%", h: "15%", fontSize: 36, bold: true, color: primaryTextColor });
          slidePpt.addShape(pres.ShapeType.line, { x: "6%", y: "22%", w: "88%", h: 0, line: { color: lineColor, width: 1.5 } });
          slidePpt.addText(slide.content, { x: "6%", y: "28%", w: "88%", h: "65%", fontSize: 20, color: secondaryTextColor, align: slide.textAlign, bold: slide.isBold, italic: slide.isItalic, underline: slide.isUnderline, valign: "top" });
        } else if (slide.type === 'split') {
          slidePpt.addText(slide.title, { x: "6%", y: "8%", w: "88%", h: "15%", fontSize: 36, bold: true, color: primaryTextColor });
          slidePpt.addShape(pres.ShapeType.line, { x: "6%", y: "22%", w: "88%", h: 0, line: { color: lineColor, width: 1.5 } });
          slidePpt.addText(slide.content, { x: "6%", y: "28%", w: "40%", h: "65%", fontSize: 20, color: secondaryTextColor, align: slide.textAlign, bold: slide.isBold, italic: slide.isItalic, underline: slide.isUnderline, valign: "top" });
          
          if (slide.image) {
            try {
              if (slide.image.startsWith('data:image')) slidePpt.addImage({ data: slide.image, x: "50%", y: "28%", w: "44%", h: "60%", sizing: { type: 'contain' } });
              else slidePpt.addImage({ path: slide.image, x: "50%", y: "28%", w: "44%", h: "60%", sizing: { type: 'contain' } });
            } catch (err) { slidePpt.addText("Image Error", { x: "50%", y: "28%", w: "44%", h: "60%", color: secondaryTextColor }); }
          } else if (slide.video) {
            slidePpt.addText("Video: " + slide.video, { x: "50%", y: "28%", w: "44%", h: "60%", color: secondaryTextColor, align: "center", valign: "middle" });
          }
        }
      });
      pres.writeFile({ fileName: "PitchPro_Presentation.pptx" });
    } catch (err) { showToast("Error generating PowerPoint."); }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const getTransitionClass = () => {
    if (!isPresenting) return '';
    switch (slides[currentSlideIndex].transition) {
      case 'fade': return 'animate-[fadeIn_0.5s_ease-in-out]';
      case 'slide-up': case 'push': return 'animate-[slideUp_0.5s_ease-out]';
      case 'zoom': return 'animate-[zoomIn_0.5s_ease-out]';
      case 'wipe': case 'split': return 'animate-[fadeIn_0.3s_ease-in]';
      case 'morph': return 'animate-[fadeIn_0.8s_ease-in-out]';
      default: return '';
    }
  };

  const getAnimationClass = () => {
    if (!isPresenting) return '';
    switch (slides[currentSlideIndex].animation) {
      case 'fade': return 'animate-[fadeIn_1s_ease-in-out_0.3s_both]';
      case 'fly-in': return 'animate-[slideUp_0.8s_ease-out_0.3s_both]';
      case 'zoom': return 'animate-[zoomIn_0.8s_ease-out_0.3s_both]';
      case 'appear': return 'animate-[fadeIn_0.1s_ease-in_0.3s_both]';
      default: return '';
    }
  };

  const currentSlide = slides[currentSlideIndex];
  const isDarkBg = currentSlide?.bgColor === '#0f172a';
  const textPrimary = isDarkBg ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkBg ? 'text-slate-300' : 'text-slate-500';

  // --- RENDERING ---

  if (showLoading) {
    return (
      <div 
        className="fixed inset-0 bg-[#060b19] flex flex-col items-center justify-center z-[100] transition-opacity duration-700 font-sans px-4 text-center overflow-hidden"
        style={{ opacity: loadingOpacity }}
      >
        <style>{`
          @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
          .animate-pulse-ring { animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
          @keyframes gradientMove { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
          .animate-float { animation: float 4s ease-in-out infinite; }
          @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
          .animate-shimmer { background-size: 200% auto; animation: shimmer 3s linear infinite; }
          @keyframes particleUp { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 20% { opacity: 0.5; } 80% { opacity: 0.5; } 100% { transform: translateY(-20vh) scale(1.5); opacity: 0; } }
          @keyframes revealUp { 0% { transform: translateY(30px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
          .animate-reveal-1 { animation: revealUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          .animate-reveal-2 { animation: revealUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s forwards; opacity: 0; }
          .animate-reveal-3 { animation: revealUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards; opacity: 0; }
        `}</style>

        {/* Animated Particle Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-indigo-400 rounded-full blur-[1px]" style={{ left: `${Math.random() * 100}%`, animation: `particleUp ${3 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 3}s`, opacity: 0 }} />
          ))}
        </div>

        {/* Central Logo - Floating and Pulsing */}
        <div className="relative flex items-center justify-center mb-10 animate-float animate-reveal-1">
          <div className="absolute w-20 h-20 sm:w-28 sm:h-28 bg-indigo-500/20 rounded-2xl animate-pulse-ring"></div>
          <div className="absolute w-20 h-20 sm:w-28 sm:h-28 bg-indigo-400/20 rounded-2xl animate-pulse-ring" style={{ animationDelay: '1.25s' }}></div>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.6)] border border-white/20">
            <Layers size={32} className="text-white sm:w-10 sm:h-10 drop-shadow-md" />
          </div>
        </div>

        {/* Shimmering Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300 mb-2 tracking-tight animate-shimmer animate-reveal-2">PitchPro</h1>
        
        {/* Progress Bar & Status Text */}
        <div className="w-56 sm:w-72 mt-8 sm:mt-10 flex flex-col items-center animate-reveal-3">
          <div className="flex justify-between w-full text-[10px] sm:text-xs font-bold text-indigo-200/80 mb-2.5 px-1 tracking-wider uppercase">
            <span>{loadingText}</span>
            <span className="tabular-nums">{loadingProgress}%</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-slate-800/80 rounded-full overflow-hidden mb-4 shadow-inner border border-white/5 relative">
            <div className="absolute top-0 left-0 h-full bg-indigo-400 blur-[4px] transition-all duration-700 ease-out" style={{ width: `${loadingProgress}%` }}></div>
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400 rounded-full transition-all duration-700 ease-out" style={{ width: `${loadingProgress}%`, backgroundSize: '200% 100%', animation: 'gradientMove 2s linear infinite' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isPresenting) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white z-[100] overflow-hidden">
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `}</style>

        {/* Dynamic Key ensures animation re-triggers on slide change */}
        <div 
          key={currentSlide.id}
          style={{ backgroundColor: currentSlide.bgColor }}
          className={`relative w-full h-full sm:h-auto max-w-[100vw] aspect-auto sm:aspect-video sm:max-w-7xl sm:shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col p-6 sm:p-12 md:p-20 overflow-hidden ${getTransitionClass()}`}
        >
          <div className={`w-full h-full flex flex-col justify-center ${getAnimationClass()}`}>
            {currentSlide.type === 'title' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h1 className={`text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 sm:mb-8 tracking-tight ${textPrimary}`}>{currentSlide.title}</h1>
                <p className={`text-lg sm:text-2xl md:text-4xl font-light max-w-4xl leading-relaxed ${textSecondary}`}>{currentSlide.subtitle}</p>
              </div>
            )}
            {currentSlide.type === 'content' && (
              <div className="flex-1 flex flex-col h-full">
                <h2 className={`text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-8 tracking-tight ${textPrimary}`}>{currentSlide.title}</h2>
                <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-indigo-500 rounded-full mb-6 sm:mb-10"></div>
                <div 
                  className={`text-lg sm:text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap flex-1 max-w-5xl ${textSecondary}`}
                  style={{ textAlign: currentSlide.textAlign, fontWeight: currentSlide.isBold ? 'bold' : 'normal', fontStyle: currentSlide.isItalic ? 'italic' : 'normal', textDecoration: currentSlide.isUnderline ? 'underline' : 'none' }}
                >
                  {currentSlide.content}
                </div>
              </div>
            )}
            {currentSlide.type === 'split' && (
              <div className="flex-1 flex flex-col h-full">
                <h2 className={`text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-8 tracking-tight ${textPrimary}`}>{currentSlide.title}</h2>
                <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-indigo-500 rounded-full mb-6 sm:mb-10"></div>
                <div className="flex flex-col sm:flex-row flex-1 gap-6 sm:gap-16">
                  <div 
                    className={`flex-1 text-lg sm:text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap ${textSecondary}`}
                    style={{ textAlign: currentSlide.textAlign, fontWeight: currentSlide.isBold ? 'bold' : 'normal', fontStyle: currentSlide.isItalic ? 'italic' : 'normal', textDecoration: currentSlide.isUnderline ? 'underline' : 'none' }}
                  >
                    {currentSlide.content}
                  </div>
                  <div className="flex-1 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col items-center justify-center bg-black/5 shadow-inner border border-white/10 min-h-[200px] sm:min-h-0">
                    {currentSlide.image ? ( <img src={currentSlide.image} className="w-full h-full object-contain" /> ) : 
                     currentSlide.video ? ( <iframe src={getEmbedUrl(currentSlide.video)} className="w-full h-full" frameBorder="0" allowFullScreen></iframe> ) : 
                     ( <div className="flex flex-col items-center opacity-40"><ImageIcon size={48} className={`mb-2 sm:mb-6 sm:w-20 sm:h-20 ${textPrimary}`} /><span className={`text-lg sm:text-2xl font-medium tracking-wide ${textPrimary}`}>Visual Area</span></div> )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`absolute bottom-4 right-6 sm:bottom-8 sm:right-10 font-medium text-sm sm:text-lg ${textSecondary} opacity-60`}>
            {currentSlideIndex + 1} <span className="mx-1 sm:mx-2 opacity-50">/</span> {slides.length}
          </div>
        </div>

        <button onClick={() => setIsPresenting(false)} className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-black/50 hover:bg-black/70 text-white p-3 sm:p-4 rounded-full transition-all z-[110]"><X size={20} className="sm:w-6 sm:h-6" /></button>
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 sm:gap-6 opacity-0 hover:opacity-100 transition-opacity duration-300 pb-2 sm:pb-4 z-[110]">
          <button onClick={prevSlide} className="bg-black/50 hover:bg-black/70 text-white p-3 sm:p-4 rounded-full backdrop-blur-md transition-all"><ChevronLeft size={24} className="sm:w-8 sm:h-8" /></button>
          <button onClick={nextSlide} className="bg-black/50 hover:bg-black/70 text-white p-3 sm:p-4 rounded-full backdrop-blur-md transition-all"><ChevronRight size={24} className="sm:w-8 sm:h-8" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900" ref={containerRef}>
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl z-[60] transition-all duration-300 flex items-center gap-2 sm:gap-3 border border-slate-700 ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <Sparkles size={16} className="text-indigo-400 sm:w-[18px] sm:h-[18px]" />
        <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{toastMessage}</span>
      </div>

      <style>{`
        @media print { 
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; } 
          .no-print { display: none !important; } 
          .print-only { display: block !important; } 
          @page { size: landscape; margin: 0; } 
        }
        .dot-grid { background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px; }
        .hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* --- HIDDEN PDF EXPORT RENDERER --- */}
      <div id="pdf-export-container" style={{ display: 'none', width: '1920px', backgroundColor: 'white' }}>
        {slides.map((slide, idx) => {
          const isPrintDark = slide.bgColor === '#0f172a';
          const printTextPrim = isPrintDark ? 'text-white' : 'text-slate-900';
          const printTextSec = isPrintDark ? 'text-slate-300' : 'text-slate-600';

          return (
          <div key={`pdf-${slide.id}`} style={{backgroundColor: slide.bgColor, width: '1920px', height: '1080px'}} className="flex flex-col p-[100px] box-border relative break-after-page">
            {slide.type === 'title' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h1 className={`text-[100px] font-extrabold mb-10 leading-tight ${printTextPrim}`}>{slide.title}</h1>
                <p className={`text-[50px] font-light max-w-[1400px] leading-relaxed ${printTextSec}`}>{slide.subtitle}</p>
              </div>
            )}
            {slide.type === 'content' && (
              <div className="flex-1 flex flex-col h-full">
                <h2 className={`text-[80px] font-extrabold mb-12 pb-6 border-b-4 border-current tracking-tight ${printTextPrim}`}>{slide.title}</h2>
                <div 
                  className={`text-[45px] leading-relaxed whitespace-pre-wrap flex-1 max-w-[1700px] ${printTextSec}`}
                  style={{ textAlign: slide.textAlign, fontWeight: slide.isBold ? 'bold' : 'normal', fontStyle: slide.isItalic ? 'italic' : 'normal', textDecoration: slide.isUnderline ? 'underline' : 'none' }}
                >
                  {slide.content}
                </div>
              </div>
            )}
            {slide.type === 'split' && (
              <div className="flex-1 flex flex-col h-full">
                <h2 className={`text-[80px] font-extrabold mb-12 pb-6 border-b-4 border-current tracking-tight ${printTextPrim}`}>{slide.title}</h2>
                <div className="flex flex-1 gap-16">
                  <div 
                    className={`flex-1 text-[45px] leading-relaxed whitespace-pre-wrap ${printTextSec}`}
                    style={{ textAlign: slide.textAlign, fontWeight: slide.isBold ? 'bold' : 'normal', fontStyle: slide.isItalic ? 'italic' : 'normal', textDecoration: slide.isUnderline ? 'underline' : 'none' }}
                  >
                    {slide.content}
                  </div>
                  <div className="flex-1 rounded-[40px] border-4 border-solid border-current flex flex-col items-center justify-center opacity-50 overflow-hidden bg-black/5">
                    {slide.image ? (
                      <img src={slide.image} className="w-full h-full object-contain" />
                    ) : slide.video ? (
                      <span className="text-[40px] font-medium">Video Embedded Here</span>
                    ) : (
                      <>
                        <ImageIcon size={120} className="mb-8" />
                        <span className="text-[40px] font-medium">Visual Area</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className={`absolute bottom-12 right-16 text-[30px] font-medium ${printTextSec} opacity-60`}>
              {idx + 1}
            </div>
          </div>
        )})}
      </div>

      {/* Main App UI */}
      <div className="flex flex-col h-screen no-print relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-14 sm:h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center px-3 sm:px-4 shrink-0 z-40 relative">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button onClick={() => setShowLeftPanel(!showLeftPanel)} className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu size={20} />
            </button>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-md">
              <Layers size={14} className="text-white sm:w-4 sm:h-4" />
            </div>
            <h1 className="font-extrabold text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 hidden xs:block">PitchPro</h1>
          </div>
          
          {/* Main Navigation Tabs */}
          <div className="flex-1 overflow-x-auto hide-scrollbar flex items-center gap-1 sm:gap-2 px-2 sm:px-6 mx-2 sm:mx-4 border-l border-r border-slate-200/50">
            {['Home', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'Record', 'Review', 'View'].map(tab => (
              <button 
                key={tab} onClick={() => { setActivePropertyTab(tab); setShowRightPanel(true); }}
                className={`flex-shrink-0 px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors ${activePropertyTab === tab && showRightPanel ? 'bg-indigo-50 shadow-sm text-indigo-700 border border-slate-200/50' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button onClick={exportPDF} className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><FileText size={14} /> <span className="hidden lg:inline">PDF</span></button>
            <button onClick={exportPPTX} className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><Download size={14} /> <span className="hidden lg:inline">PPTX</span></button>
            <div className="w-px h-4 bg-slate-200 mx-0.5 sm:mx-1"></div>
            <button onClick={() => { setViewMode('Normal'); setCurrentSlideIndex(0); setIsPresenting(true); }} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 text-xs font-bold bg-slate-900 text-white hover:bg-indigo-600 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"><MonitorPlay size={14} className="text-indigo-300" /> <span className="hidden sm:inline">Present</span></button>
            <button onClick={() => setShowRightPanel(!showRightPanel)} className="lg:hidden ml-1 p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings2 size={20} />
            </button>
          </div>
        </header>

        {/* Workspace Layout */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Overlay for mobile sidebars */}
          {(showLeftPanel || showRightPanel) && (
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-20 lg:hidden transition-opacity"
              onClick={() => { setShowLeftPanel(false); setShowRightPanel(false); }}
            ></div>
          )}

          {/* Left Sidebar - Thumbnails */}
          <aside className={`absolute md:relative left-0 top-0 h-full w-64 sm:w-72 bg-white border-r border-slate-200/80 flex flex-col overflow-y-auto shrink-0 z-30 transition-transform duration-300 ease-in-out ${showLeftPanel ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 md:shadow-[4px_0_24px_rgba(0,0,0,0.02)]'} ${viewMode === 'SlideSorter' ? 'md:hidden' : ''}`}>
            <div className="p-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-slate-100">
              <button onClick={() => addSlide('content')} className="w-full flex items-center justify-center gap-2 bg-indigo-50/50 border border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 py-2.5 rounded-xl text-sm font-bold transition-all"><Plus size={16} /> New Slide</button>
            </div>
            <div className="flex-1 px-4 py-3 space-y-3">
              {slides.map((slide, idx) => (
                <div key={slide.id} onClick={() => { setCurrentSlideIndex(idx); if(window.innerWidth < 768) setShowLeftPanel(false); }} className={`group relative flex flex-col cursor-pointer transition-all duration-200 ${currentSlideIndex === idx ? 'scale-100' : 'scale-95 hover:scale-100'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${currentSlideIndex === idx ? 'text-indigo-600' : 'text-slate-400'}`}>Slide {idx + 1}</span>
                    <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => duplicateSlide(e, idx)} className="text-slate-400 hover:text-emerald-600 bg-white rounded p-1" title="Duplicate"><Copy size={14} className="sm:w-3 sm:h-3" /></button>
                      {slides.length > 1 && <button onClick={(e) => deleteSlide(e, idx)} className="text-slate-400 hover:text-red-600 bg-white rounded p-1" title="Delete"><Trash2 size={14} className="sm:w-3 sm:h-3" /></button>}
                    </div>
                  </div>
                  <div style={{ backgroundColor: slide.bgColor }} className={`aspect-video rounded-xl border-2 overflow-hidden flex flex-col p-2 shadow-sm relative ${currentSlideIndex === idx ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200 hover:border-indigo-300'}`}>
                    {slide.type === 'title' && <div className="flex-1 flex flex-col justify-center items-center text-center"><div className={`text-[8px] sm:text-[10px] font-bold line-clamp-2 ${slide.bgColor === '#0f172a' ? 'text-white' : 'text-slate-800'}`}>{slide.title || 'Title'}</div></div>}
                    {(slide.type === 'content' || slide.type === 'split') && (
                      <div className="flex-1 flex flex-col">
                        <div className={`text-[8px] sm:text-[10px] font-bold border-b border-slate-500/20 pb-0.5 mb-1 truncate ${slide.bgColor === '#0f172a' ? 'text-white' : 'text-slate-800'}`}>{slide.title || 'Title'}</div>
                        <div className={`text-[6px] sm:text-[8px] leading-tight line-clamp-3 ${slide.bgColor === '#0f172a' ? 'text-slate-300' : 'text-slate-400'}`}>{slide.content || 'Content...'}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Stage - Editor or Slide Sorter */}
          <main className={`flex-1 flex overflow-y-auto relative dot-grid z-0 w-full ${viewMode === 'SlideSorter' ? 'flex-wrap items-start justify-center p-4 sm:p-12 gap-4 sm:gap-8' : 'flex-col items-center justify-start p-3 sm:p-8'}`}>
            
            {viewMode === 'SlideSorter' ? (
              // SLIDE SORTER VIEW
              slides.map((slide, idx) => (
                <div key={slide.id} className="flex flex-col items-center group w-full sm:w-auto">
                  <div 
                    onClick={() => { setViewMode('Normal'); setCurrentSlideIndex(idx); }}
                    style={{ backgroundColor: slide.bgColor }} 
                    className="w-full sm:w-72 aspect-video rounded-xl shadow-md border-2 border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer p-4 overflow-hidden relative"
                  >
                    <h3 className={`text-sm font-bold truncate mb-2 ${slide.bgColor === '#0f172a' ? 'text-white' : 'text-slate-800'}`}>{slide.title || 'Untitled'}</h3>
                    <p className={`text-[10px] leading-relaxed line-clamp-4 ${slide.bgColor === '#0f172a' ? 'text-slate-300' : 'text-slate-500'}`}>{slide.content}</p>
                    {slide.image && <ImageIcon size={16} className="absolute bottom-3 right-3 text-slate-400" />}
                  </div>
                  <span className="mt-3 text-sm font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">Slide {idx + 1}</span>
                </div>
              ))
            ) : (
              // NORMAL CANVAS VIEW
              <>
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 z-20 mb-4 sm:mb-8 mt-1 sm:mt-2">
                  <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2 sm:ml-3 mr-1 sm:mr-2">Layout</span>
                  <div className="w-px h-4 sm:h-6 bg-slate-200 mr-1 sm:mr-2"></div>
                  <button onClick={() => { changeSlideType('title'); if(window.innerWidth < 1024) setShowRightPanel(false); }} className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all flex items-center gap-1 sm:gap-2 ${currentSlide.type === 'title' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Type size={16} className="sm:w-[18px] sm:h-[18px]" /><span className="text-xs font-semibold pr-1 hidden sm:block">Title</span></button>
                  <button onClick={() => { changeSlideType('content'); if(window.innerWidth < 1024) setShowRightPanel(false); }} className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all flex items-center gap-1 sm:gap-2 ${currentSlide.type === 'content' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><AlignLeft size={16} className="sm:w-[18px] sm:h-[18px]" /><span className="text-xs font-semibold pr-1 hidden sm:block">Content</span></button>
                  <button onClick={() => { changeSlideType('split'); if(window.innerWidth < 1024) setShowRightPanel(false); }} className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all flex items-center gap-1 sm:gap-2 ${currentSlide.type === 'split' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><LayoutTemplate size={16} className="sm:w-[18px] sm:h-[18px]" /><span className="text-xs font-semibold pr-1 hidden sm:block">Split</span></button>
                </div>

                <div style={{ backgroundColor: currentSlide.bgColor }} className="w-full max-w-5xl aspect-video shadow-xl sm:shadow-2xl shadow-slate-300/40 rounded-xl sm:rounded-2xl flex flex-col relative overflow-hidden ring-1 ring-slate-200/50 transition-all">
                  
                  {currentSlide.type === 'title' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-20 text-center group">
                      <input type="text" value={currentSlide.title} onChange={(e) => updateCurrentSlide('title', e.target.value)}
                        className={`w-full text-center text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-transparent border-none outline-none focus:bg-slate-500/5 hover:bg-slate-500/5 rounded-xl sm:rounded-2xl p-2 sm:p-4 mb-2 sm:mb-4 transition-colors placeholder:opacity-50 ${textPrimary}`} placeholder="Presentation Title" />
                      <input type="text" value={currentSlide.subtitle} onChange={(e) => updateCurrentSlide('subtitle', e.target.value)}
                        className={`w-full text-center text-sm sm:text-2xl lg:text-3xl font-medium bg-transparent border-none outline-none focus:bg-slate-500/5 hover:bg-slate-500/5 rounded-lg sm:rounded-xl p-2 sm:p-3 transition-colors placeholder:opacity-50 ${textSecondary}`} placeholder="Add a subtitle..." />
                    </div>
                  )}

                  {currentSlide.type === 'content' && (
                    <div className="flex-1 flex flex-col p-4 sm:p-10 lg:p-16 h-full">
                      <div className="relative mb-4 sm:mb-8">
                        <input type="text" value={currentSlide.title} onChange={(e) => updateCurrentSlide('title', e.target.value)}
                          className={`w-full text-xl sm:text-4xl lg:text-5xl font-extrabold bg-transparent border-none outline-none focus:bg-slate-500/5 hover:bg-slate-500/5 rounded-lg sm:rounded-xl p-2 sm:p-3 transition-colors placeholder:opacity-50 tracking-tight ${textPrimary}`} placeholder="Slide Title" />
                        <div className="absolute bottom-0 left-2 sm:left-3 w-8 sm:w-16 h-0.5 sm:h-1 bg-indigo-500 rounded-full"></div>
                      </div>
                      <textarea value={currentSlide.content} onChange={(e) => updateCurrentSlide('content', e.target.value)}
                        style={{ textAlign: currentSlide.textAlign, fontWeight: currentSlide.isBold ? 'bold' : 'normal', fontStyle: currentSlide.isItalic ? 'italic' : 'normal', textDecoration: currentSlide.isUnderline ? 'underline' : 'none' }}
                        className={`w-full flex-1 text-xs sm:text-xl lg:text-2xl bg-transparent border-none outline-none focus:bg-slate-500/5 hover:bg-slate-500/5 rounded-lg sm:rounded-xl p-2 sm:p-3 resize-none leading-relaxed transition-colors placeholder:opacity-50 ${textSecondary}`} placeholder="Enter your content here..." />
                    </div>
                  )}

                  {currentSlide.type === 'split' && (
                    <div className="flex-1 flex flex-col p-4 sm:p-10 lg:p-16 h-full">
                      <div className="relative mb-3 sm:mb-8">
                        <input type="text" value={currentSlide.title} onChange={(e) => updateCurrentSlide('title', e.target.value)}
                          className={`w-full text-xl sm:text-4xl lg:text-5xl font-extrabold bg-transparent border-none outline-none focus:bg-slate-500/5 hover:bg-slate-500/5 rounded-lg sm:rounded-xl p-2 sm:p-3 transition-colors placeholder:opacity-50 tracking-tight ${textPrimary}`} placeholder="Slide Title" />
                         <div className="absolute bottom-0 left-2 sm:left-3 w-8 sm:w-16 h-0.5 sm:h-1 bg-indigo-500 rounded-full"></div>
                      </div>
                      <div className="flex flex-row flex-1 gap-3 sm:gap-12">
                        <textarea value={currentSlide.content} onChange={(e) => updateCurrentSlide('content', e.target.value)}
                          style={{ textAlign: currentSlide.textAlign, fontWeight: currentSlide.isBold ? 'bold' : 'normal', fontStyle: currentSlide.isItalic ? 'italic' : 'normal', textDecoration: currentSlide.isUnderline ? 'underline' : 'none' }}
                          className={`w-1/2 h-full text-[10px] sm:text-lg lg:text-2xl bg-transparent border-none outline-none focus:bg-slate-500/5 hover:bg-slate-500/5 rounded-lg sm:rounded-xl p-1 sm:p-3 resize-none leading-relaxed transition-colors placeholder:opacity-50 ${textSecondary}`} placeholder="Enter text on the left..." />
                        <div className="w-1/2 h-full bg-slate-500/5 rounded-xl sm:rounded-3xl border sm:border-2 border-dashed border-current/20 flex flex-col items-center justify-center text-current/40 p-1 sm:p-2 text-center group transition-colors relative overflow-hidden">
                          {currentSlide.image ? (
                            <><img src={currentSlide.image} alt="Uploaded" className="w-full h-full object-contain rounded-lg sm:rounded-2xl" />
                            <button onClick={() => updateCurrentSlide('image', null)} className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-slate-900/70 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur"><Trash2 size={14} className="sm:w-4 sm:h-4" /></button></>
                          ) : currentSlide.video ? (
                            <><iframe src={getEmbedUrl(currentSlide.video)} className="w-full h-full rounded-lg sm:rounded-2xl bg-black" frameBorder="0" allowFullScreen></iframe>
                            <button onClick={() => updateCurrentSlide('video', null)} className="absolute -top-10 right-2 sm:right-4 group-hover:top-2 sm:group-hover:top-4 bg-red-600/90 text-white p-1.5 sm:p-2 rounded-full transition-all backdrop-blur z-10"><Trash2 size={14} className="sm:w-4 sm:h-4" /></button></>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full opacity-60">
                              <ImageIcon size={24} className="mb-1 sm:mb-4 sm:w-12 sm:h-12" />
                              <p className={`font-bold text-[10px] sm:text-lg ${textSecondary}`}>Media Placeholder</p>
                              <p className="hidden sm:block text-sm mt-2 max-w-[80%] leading-relaxed">Use the Insert tab on the right panel to add media.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="mt-4 sm:mt-8 flex items-center gap-4 sm:gap-6 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-sm border border-slate-200/80 mb-6">
                  <button onClick={prevSlide} disabled={currentSlideIndex === 0} className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"><ChevronLeft size={18} className="sm:w-5 sm:h-5" /></button>
                  <span className="font-semibold text-slate-500 text-xs sm:text-sm tracking-wide">Slide {currentSlideIndex + 1} of {slides.length}</span>
                  <button onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1} className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"><ChevronRight size={18} className="sm:w-5 sm:h-5" /></button>
                </div>
              </>
            )}
          </main>

          {/* Advanced Properties Inspector (Ribbon Replacement) */}
          <aside className={`absolute lg:relative right-0 top-0 h-full w-[280px] sm:w-[340px] bg-white border-l border-slate-200/80 flex flex-col shrink-0 z-30 transition-transform duration-300 ease-in-out ${showRightPanel ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0 lg:shadow-[-4px_0_24px_rgba(0,0,0,0.02)]'}`}>
            
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4 bg-slate-50/50 sticky top-0 z-10">
              <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">{activePropertyTab} Tools</h2>
              <button onClick={() => setShowRightPanel(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/30">
              
              {/* HOME TAB */}
              {activePropertyTab === 'Home' && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Clipboard</h3>
                    <div className="flex gap-2">
                      <button onClick={()=>showToast("Pasted!")} className="flex-1 flex flex-col items-center justify-center p-2 sm:p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 text-amber-600 transition-colors"><ClipboardPaste size={18} className="sm:w-5 sm:h-5 mb-1"/><span className="text-[10px] sm:text-xs font-medium">Paste</span></button>
                      <div className="flex-1 flex flex-col gap-2">
                        <button className="flex items-center justify-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><Scissors size={12} className="sm:w-3.5 sm:h-3.5"/><span className="text-[10px] font-medium">Cut</span></button>
                        <button onClick={(e)=>duplicateSlide(e, currentSlideIndex)} className="flex items-center justify-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><Copy size={12} className="sm:w-3.5 sm:h-3.5"/><span className="text-[10px] font-medium">Copy</span></button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Font & Paragraph</h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-1 mb-2 flex gap-1 justify-center">
                      <button onClick={() => updateCurrentSlide('isBold', !currentSlide.isBold)} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${currentSlide.isBold ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'}`}><Bold size={14} className="sm:w-4 sm:h-4" /></button>
                      <button onClick={() => updateCurrentSlide('isItalic', !currentSlide.isItalic)} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${currentSlide.isItalic ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'}`}><Italic size={14} className="sm:w-4 sm:h-4" /></button>
                      <button onClick={() => updateCurrentSlide('isUnderline', !currentSlide.isUnderline)} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${currentSlide.isUnderline ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'}`}><Underline size={14} className="sm:w-4 sm:h-4" /></button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-1 flex gap-1 justify-center">
                      <button onClick={() => updateCurrentSlide('textAlign', 'left')} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${currentSlide.textAlign === 'left' ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'}`}><AlignLeft size={14} className="sm:w-4 sm:h-4" /></button>
                      <button onClick={() => updateCurrentSlide('textAlign', 'center')} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${currentSlide.textAlign === 'center' ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'}`}><AlignCenter size={14} className="sm:w-4 sm:h-4" /></button>
                      <button onClick={() => updateCurrentSlide('textAlign', 'right')} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${currentSlide.textAlign === 'right' ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'}`}><AlignRight size={14} className="sm:w-4 sm:h-4" /></button>
                      <button onClick={() => updateCurrentSlide('textAlign', 'justify')} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${currentSlide.textAlign === 'justify' ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'}`}><AlignJustify size={14} className="sm:w-4 sm:h-4" /></button>
                    </div>
                  </div>

                  <div>
                     <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Slides</h3>
                     <button onClick={() => addSlide('content')} className="w-full flex items-center justify-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white py-2.5 sm:py-3 rounded-xl font-bold transition-colors"><Plus size={16} /> New Slide</button>
                  </div>
                </div>
              )}

              {/* INSERT TAB */}
              {activePropertyTab === 'Insert' && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-amber-50 text-amber-800 p-2 sm:p-3 rounded-xl text-xs border border-amber-200">
                    <strong>Tip:</strong> Media renders best when using the "Split" layout.
                  </div>

                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Images</h3>
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-green-400 hover:bg-green-50 text-slate-700 font-medium py-2.5 sm:py-3 rounded-xl transition-colors mb-2 sm:mb-3 text-sm">
                      <ImageIcon size={16} className="text-green-600 sm:w-[18px] sm:h-[18px]" /> Upload Image
                    </button>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LinkIcon size={12} className="text-slate-400 sm:w-[14px] sm:h-[14px]" /></div>
                      <input type="url" placeholder="Or paste image URL..." value={currentSlide.image && currentSlide.image.startsWith('http') ? currentSlide.image : ''} onChange={(e) => { updateCurrentSlide('image', e.target.value); if(e.target.value) updateCurrentSlide('video', null); }} className="w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Video</h3>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Video size={12} className="text-blue-500 sm:w-[14px] sm:h-[14px]" /></div>
                      <input type="url" placeholder="Paste YouTube URL..." value={currentSlide.video || ''} onChange={(e) => { updateCurrentSlide('video', e.target.value); if(e.target.value) updateCurrentSlide('image', null); }} className="w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>

                  <div>
                     <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Illustrations & Media</h3>
                     <div className="grid grid-cols-2 gap-2">
                        <button onClick={()=>showToast("Shapes coming soon!")} className="flex flex-col items-center justify-center gap-1 p-2 sm:p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"><Shapes size={16} className="sm:w-[18px] sm:h-[18px]"/><span className="text-[9px] sm:text-[10px] font-medium">Shapes</span></button>
                        <button onClick={()=>showToast("Tables coming soon!")} className="flex flex-col items-center justify-center gap-1 p-2 sm:p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"><Table size={16} className="sm:w-[18px] sm:h-[18px]"/><span className="text-[9px] sm:text-[10px] font-medium">Table</span></button>
                        <button onClick={()=>showToast("3D Models coming soon!")} className="flex flex-col items-center justify-center gap-1 p-2 sm:p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"><Box size={16} className="sm:w-[18px] sm:h-[18px]"/><span className="text-[9px] sm:text-[10px] font-medium">3D Models</span></button>
                        <button onClick={()=>showToast("Charts coming soon!")} className="flex flex-col items-center justify-center gap-1 p-2 sm:p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"><PieChart size={16} className="sm:w-[18px] sm:h-[18px]"/><span className="text-[9px] sm:text-[10px] font-medium">Chart</span></button>
                     </div>
                  </div>
                </div>
              )}

              {/* DESIGN TAB */}
              {activePropertyTab === 'Design' && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">Themes & Background</h3>
                    <div className="grid grid-cols-5 gap-2 sm:gap-3">
                      {COLOR_PALETTE.map((color) => (
                        <button key={color} onClick={() => updateCurrentSlide('bgColor', color)} className={`aspect-square rounded-full border-2 transition-transform shadow-sm ${currentSlide.bgColor === color ? 'border-indigo-500 scale-110' : 'border-slate-200 hover:scale-105'}`} style={{ backgroundColor: color }} title={color} />
                      ))}
                    </div>
                  </div>
                  <button onClick={()=>showToast("Use color palette above")} className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-colors"><Palette size={14} className="sm:w-4 sm:h-4" /> Format Background</button>
                </div>
              )}

              {/* TRANSITIONS TAB */}
              {activePropertyTab === 'Transitions' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Transition to This Slide</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['none', 'morph', 'fade', 'push', 'wipe', 'split', 'zoom'].map((trans) => (
                      <button 
                        key={trans} onClick={() => updateCurrentSlide('transition', trans)}
                        className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border transition-colors ${currentSlide.transition === trans ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        <Wand2 size={14} className={`sm:w-4 sm:h-4 ${currentSlide.transition === trans ? 'text-indigo-500' : 'text-slate-400'}`} />
                        <span className="text-[10px] sm:text-[11px] font-semibold capitalize">{trans}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ANIMATIONS TAB */}
              {activePropertyTab === 'Animations' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Element Animation</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['none', 'appear', 'fade', 'fly-in', 'zoom'].map((anim) => (
                      <button 
                        key={anim} onClick={() => updateCurrentSlide('animation', anim)}
                        className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border transition-colors ${currentSlide.animation === anim ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        <Sparkles size={14} className={`sm:w-4 sm:h-4 ${currentSlide.animation === anim ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span className="text-[10px] sm:text-[11px] font-semibold capitalize">{anim.replace('-', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE SHOW TAB */}
              {activePropertyTab === 'Slide Show' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Start Slide Show</h3>
                  <button onClick={() => { setViewMode('Normal'); setCurrentSlideIndex(0); setIsPresenting(true); }} className="w-full flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 hover:border-green-400 hover:bg-green-50 text-slate-700 font-medium p-3 sm:p-4 rounded-xl transition-colors mb-2">
                    <PlaySquare size={20} className="text-green-600 sm:w-6 sm:h-6" /> <div className="text-left"><p className="text-xs sm:text-sm font-bold text-slate-800">From Beginning</p><p className="text-[9px] sm:text-[10px] text-slate-500">Start from slide 1</p></div>
                  </button>
                  <button onClick={() => { setViewMode('Normal'); setIsPresenting(true); }} className="w-full flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 font-medium p-3 sm:p-4 rounded-xl transition-colors">
                    <MonitorPlay size={20} className="text-blue-600 sm:w-6 sm:h-6" /> <div className="text-left"><p className="text-xs sm:text-sm font-bold text-slate-800">From Current Slide</p><p className="text-[9px] sm:text-[10px] text-slate-500">Start from slide {currentSlideIndex + 1}</p></div>
                  </button>
                  
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3 mt-6 sm:mt-8">Monitors</h3>
                  <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" /> Use Presenter View
                  </label>
                </div>
              )}

              {/* RECORD TAB */}
              {activePropertyTab === 'Record' && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Record</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={()=>showToast("Recording started")} className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50 text-slate-700 transition-colors"><div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-100 flex items-center justify-center"><div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div></div><span className="text-[9px] sm:text-[10px] font-medium text-center">From Beginning</span></button>
                      <button onClick={()=>showToast("Screen Recording mock")} className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"><ScreenShare size={16} className="text-slate-500 sm:w-5 sm:h-5"/><span className="text-[9px] sm:text-[10px] font-medium text-center">Screen Recording</span></button>
                      <button onClick={()=>showToast("Audio recording mock")} className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"><Mic size={16} className="text-slate-500 sm:w-5 sm:h-5"/><span className="text-[9px] sm:text-[10px] font-medium text-center">Audio</span></button>
                    </div>
                  </div>
                  <div>
                     <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Export</h3>
                     <button onClick={exportPPTX} className="w-full flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium p-2.5 sm:p-3 rounded-xl transition-colors mb-2 text-sm"><FileVideo size={16} className="text-slate-500 sm:w-[18px] sm:h-[18px]" /> Export to Video</button>
                  </div>
                </div>
              )}

              {/* REVIEW TAB */}
              {activePropertyTab === 'Review' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Proofing & Language</h3>
                  <button 
                    onClick={handleSpellCheck} 
                    disabled={isCheckingGrammar}
                    className="w-full flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-medium p-2.5 sm:p-3 rounded-xl transition-colors mb-2 text-sm disabled:opacity-50"
                  >
                    {isCheckingGrammar ? <div className="w-4 h-4 sm:w-[18px] sm:h-[18px] border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={16} className="text-blue-500 sm:w-[18px] sm:h-[18px]" />}
                    {isCheckingGrammar ? "Checking..." : "Spelling & Grammar"}
                  </button>
                  
                  <div className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe size={16} className="text-slate-500 sm:w-[18px] sm:h-[18px]" />
                      <span className="text-sm font-medium text-slate-700">Translate</span>
                    </div>
                    <select 
                      value={targetLanguage} 
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full mb-3 p-2 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                    <button 
                      onClick={handleTranslate} 
                      disabled={isTranslating}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium p-2 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50"
                    >
                      {isTranslating ? <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /> : null}
                      {isTranslating ? "Translating..." : "Translate Slide"}
                    </button>
                  </div>
                  
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Comments</h3>
                  <button onClick={()=>showToast("Comment box opened")} className="w-full flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium p-2.5 sm:p-3 rounded-xl transition-colors text-sm"><MessageSquare size={16} className="text-slate-500 sm:w-[18px] sm:h-[18px]" /> New Comment</button>
                </div>
              )}

              {/* VIEW TAB */}
              {activePropertyTab === 'View' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">Presentation Views</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setViewMode('Normal'); if(window.innerWidth < 1024) setShowRightPanel(false); }} className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border transition-colors ${viewMode === 'Normal' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}><Presentation size={16} className="sm:w-5 sm:h-5" /><span className="text-[10px] sm:text-[11px] font-semibold">Normal</span></button>
                    <button onClick={() => { setViewMode('SlideSorter'); if(window.innerWidth < 1024) setShowRightPanel(false); }} className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border transition-colors ${viewMode === 'SlideSorter' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}><LayoutGrid size={16} className="sm:w-5 sm:h-5" /><span className="text-[10px] sm:text-[11px] font-semibold">Slide Sorter</span></button>
                    <button onClick={()=>showToast("Outline View coming soon")} className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"><List size={16} className="sm:w-5 sm:h-5" /><span className="text-[10px] sm:text-[11px] font-semibold">Outline View</span></button>
                    <button onClick={()=>showToast("Notes view coming soon")} className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"><FileText size={16} className="sm:w-5 sm:h-5" /><span className="text-[10px] sm:text-[11px] font-semibold">Notes Page</span></button>
                  </div>
                  
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3 mt-4 sm:mt-6">Show</h3>
                  <div className="space-y-2 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 cursor-pointer hover:text-indigo-600"><input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" /> Ruler</label>
                    <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 cursor-pointer hover:text-indigo-600"><input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" /> Gridlines</label>
                    <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 cursor-pointer hover:text-indigo-600"><input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" /> Guides</label>
                  </div>
                </div>
              )}

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}