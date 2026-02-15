import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        howItWorks: 'How It Works',
        contact: 'Contact',
        dashboard: 'Dashboard',
        profile: 'Profile',
        login: 'Login',
        logout: 'Logout',
      },
      hero: {
        title: 'Smart Crop Advisory System',
        subtitle: 'Get AI-powered crop recommendations based on your location, soil type, and market prices. Make informed decisions for maximum profitability.',
        getStarted: 'Get Started',
        learnMore: 'Learn More',
      },
      about: {
        title: 'About Our Platform',
        description: 'We help farmers make data-driven decisions using machine learning and real-time market data.',
      },
      howItWorks: {
        title: 'How It Works',
        step1: 'Enter your farm details',
        step2: 'Get AI recommendations',
        step3: 'Grow profitable crops',
      },
      auth: {
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        fullName: 'Full Name',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
      },
      dashboard: {
        title: 'Crop Advisory Dashboard',
        subtitle: 'Enter your farm details to receive personalized recommendations',
        prompt: 'Submit the form to see your personalized dashboard.'
      },
      common: {
        unavailable: 'Unavailable',
        na: 'N/A'
      },
      form: {
        state: 'State',
        district: 'District',
        market: 'Market Name',
        landType: 'Soil Type',
        landSize: 'Land Size (acres)',
        season: 'Season',
        submit: 'Get Recommendations',
        analyzing: 'Analyzing...',
      },
      profile: {
        title: 'My Profile',
        updateProfile: 'Update Profile',
        recommendationsHistory: 'Recommendations History',
      },
      ui: {
        searchPlaceholder: 'Search plant here...'
      },
      labels: {
        soil: 'Soil',
        season: 'Season'
      },
      widgets: {
        weatherToday: 'Weather today',
        plantGrowth: 'Plant growth activity',
        location: 'Location'
      },
      charts: {
        summaryProduction: 'Summary of production'
      },
      tile: {
        verticalHarvestTitle: 'Vertical Harvest Farms',
        verticalHarvestDesc: 'Stack crops efficiently using vertical space in greenhouses or urban farms.'
      },
      buttons: {
        reenterDetails: 'Re-enter details'
      },
      rec: {
        title: 'Crop Recommendation',
        bestEnvironmentalMatch: 'Best environmental match',
        mostSuitable: 'Most Suitable Crop',
        mostProfitable: 'Most Profitable Crop',
        scoringWeights: 'Scoring Weights',
        price: 'Price',
        suitability: 'Suitability',
        combined: 'Combined',
        filters: {
          ranking: 'Ranking',
          profitability: 'Profitability',
          suitability: 'Suitability'
        },
        scoreDistribution: 'Score distribution',
        envMatchScore: 'Environmental match score',
        combinedScore: 'Combined Score',
        notePerQuintal: 'Note: All prices are shown per quintal (100 kg).'
      },
      common: {
        noData: 'No data available'
      },
      debug: {
        totalCropsEvaluated: 'Total crops evaluated:',
        cropsWithPrices: 'Crops with price data:',
        cropsWithoutPrices: 'Crops without price data:'
      }
    },
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        about: 'हमारे बारे में',
        howItWorks: 'यह कैसे काम करता है',
        contact: 'संपर्क करें',
        dashboard: 'डैशबोर्ड',
        profile: 'प्रोफ़ाइल',
        login: 'लॉगिन',
        logout: 'लॉगआउट',
      },
      hero: {
        title: 'स्मार्ट फसल सलाहकार प्रणाली',
        subtitle: 'अपने स्थान, मिट्टी के प्रकार और बाज़ार मूल्यों के आधार पर एआई-संचालित फसल अनुशंसाएँ प्राप्त करें। सूचित निर्णय लें और लाभ बढ़ाएँ।',
        getStarted: 'शुरू करें',
        learnMore: 'और जानें',
      },
      about: {
        title: 'हमारे प्लेटफ़ॉर्म के बारे में',
        description: 'हम मशीन लर्निंग और वास्तविक समय के बाज़ार डेटा का उपयोग करके किसानों को निर्णय लेने में मदद करते हैं।',
      },
      howItWorks: {
        title: 'यह कैसे काम करता है',
        step1: 'अपने खेत का विवरण दर्ज करें',
        step2: 'एआई अनुशंसाएँ प्राप्त करें',
        step3: 'लाभदायक फसल उगाएँ',
      },
      auth: {
        login: 'लॉगिन',
        register: 'रजिस्टर',
        email: 'ईमेल',
        password: 'पासवर्ड',
        fullName: 'पूरा नाम',
        signIn: 'साइन इन करें',
        signUp: 'साइन अप करें',
        noAccount: 'खाता नहीं है?',
        haveAccount: 'पहले से खाता है?',
      },
      dashboard: {
        title: 'फसल सलाह डैशबोर्ड',
        subtitle: 'व्यक्तिगत सिफारिशें प्राप्त करने के लिए अपने खेत का विवरण दर्ज करें',
        prompt: 'व्यक्तिगत डैशबोर्ड देखने के लिए फ़ॉर्म जमा करें।'
      },
      common: {
        unavailable: 'उपलब्ध नहीं',
        na: 'एन/ए'
      },
      form: {
        state: 'राज्य',
        district: 'ज़िला',
        market: 'बाज़ार का नाम',
        landType: 'मिट्टी का प्रकार',
        landSize: 'भूमि का आकार (एकड़)',
        season: 'मौसम',
        submit: 'सिफारिशें प्राप्त करें',
        analyzing: 'विश्लेषण हो रहा है...',
      },
      profile: {
        title: 'मेरा प्रोफ़ाइल',
        updateProfile: 'प्रोफ़ाइल अपडेट करें',
        recommendationsHistory: 'सिफारिशों का इतिहास',
      },
      ui: {
        searchPlaceholder: 'यहाँ पौधा खोजें...'
      },
      labels: {
        soil: 'मिट्टी',
        season: 'मौसम'
      },
      widgets: {
        weatherToday: 'आज का मौसम',
        plantGrowth: 'पौधों की वृद्धि गतिविधि',
        location: 'स्थान'
      },
      charts: {
        summaryProduction: 'उत्पादन का सारांश'
      },
      tile: {
        verticalHarvestTitle: 'वर्टिकल हार्वेस्ट फ़ार्म्स',
        verticalHarvestDesc: 'ग्रीनहाउस या शहरी खेतों में वर्टिकल स्पेस का उपयोग कर फसलों को कुशलतापूर्वक स्टैक करें।'
      },
      buttons: {
        reenterDetails: 'विवरण फिर से दर्ज करें'
      },
      rec: {
        title: 'फसल अनुशंसा',
        bestEnvironmentalMatch: 'सर्वोत्तम पर्यावरणीय मिलान',
        mostSuitable: 'सबसे उपयुक्त फसल',
        mostProfitable: 'सबसे लाभदायक फसल',
        scoringWeights: 'स्कोरिंग वेट',
        price: 'मूल्य',
        suitability: 'उपयुक्तता',
        combined: 'संयुक्त',
        filters: {
          ranking: 'रैंकिंग',
          profitability: 'लाभ',
          suitability: 'उपयुक्तता'
        },
        scoreDistribution: 'स्कोर वितरण',
        envMatchScore: 'पर्यावरण मेल स्कोर',
        combinedScore: 'संयुक्त स्कोर',
        notePerQuintal: 'नोट: सभी कीमतें प्रति क्विंटल (100 कि.ग्रा.) में दिखाई जाती हैं।'
      },
      common: {
        noData: 'डेटा उपलब्ध नहीं'
      },
      debug: {
        totalCropsEvaluated: 'कुल फसलें मूल्यांकित:',
        cropsWithPrices: 'कीमत डेटा वाली फसलें:',
        cropsWithoutPrices: 'कीमत डेटा बिना फसलें:'
      }
    },
  },
  kn: {
    translation: {
      nav: {
        home: 'ಮುಖಪುಟ',
        about: 'ನಮ್ಮ ಬಗ್ಗೆ',
        howItWorks: 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
        contact: 'ಸಂಪರ್ಕ',
        dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        profile: 'ಪ್ರೊಫೈಲ್',
        login: 'ಲಾಗಿನ್',
        logout: 'ಲಾಗೌಟ್',
      },
      hero: {
        title: 'ಸ್ಮಾರ್ಟ್ ಕ್ರಾಪ್ ಸಲಹಾ ವ್ಯವಸ್ಥೆ',
        subtitle: 'ನಿಮ್ಮ ಸ್ಥಳ, ಮಣ್ಣು ಪ್ರಕಾರ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಆಧಾರದಲ್ಲಿ ಎಐ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ. ಹೆಚ್ಚು ಲಾಭಕ್ಕಾಗಿ ತಿಳಿದ ನಿರ್ಧಾರಗಳನ್ನು ಕೈಗೊಳ್ಳಿ.',
        getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
        learnMore: 'ಇನ್ನಷ್ಟು ತಿಳಿದುಕೊಳ್ಳಿ',
      },
      about: {
        title: 'ನಮ್ಮ ವೇದಿಕೆಯ ಬಗ್ಗೆ',
        description: 'ಮಶೀನ್ ಲರ್ನಿಂಗ್ ಮತ್ತು ಸಮಯೋಚಿತ ಮಾರುಕಟ್ಟೆ ಡೇಟಾ ಬಳಸಿ ರೈತರಿಗೆ ಡೇಟಾ ಆಧಾರಿತ ನಿರ್ಧಾರಗಳಲ್ಲಿ ನೆರವಾಗುತ್ತೇವೆ.',
      },
      howItWorks: {
        title: 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
        step1: 'ನಿಮ್ಮ ಕೃಷಿ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
        step2: 'ಎಐ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ',
        step3: 'ಲಾಭದಾಯಕ ಬೆಳೆ ಬೆಳೆಯಿರಿ',
      },
      auth: {
        login: 'ಲಾಗಿನ್',
        register: 'ನೋಂದಣಿ',
        email: 'ಇಮೇಲ್',
        password: 'ಪಾಸ್ವರ್ಡ್',
        fullName: 'ಪೂರ್ಣ ಹೆಸರು',
        signIn: 'ಸೈನ್ ಇನ್',
        signUp: 'ಸೈನ್ ಅಪ್',
        noAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
        haveAccount: 'ಈಗಾಗಲೇ ಖಾತೆಯಿದೆಯೇ?',
      },
      dashboard: {
        title: 'ಬೆಳೆ ಸಲಹಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        subtitle: 'ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ನಿಮ್ಮ ಕೃಷಿ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
        prompt: 'ವೈಯಕ್ತಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನೋಡಲು ಫಾರ್ಮ್ ಸಲ್ಲಿಸಿ.'
      },
      common: {
        unavailable: 'ಲಭ್ಯವಿಲ್ಲ',
        na: 'N/A'
      },
      form: {
        state: 'ರಾಜ್ಯ',
        district: 'ಜಿಲ್ಲೆ',
        market: 'ಮಾರುಕಟ್ಟೆ ಹೆಸರು',
        landType: 'ಮಣ್ಣು ಪ್ರಕಾರ',
        landSize: 'ಜಮೀನು ಗಾತ್ರ (ಎಕರೆ)',
        season: 'ಋತು',
        submit: 'ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ',
        analyzing: 'ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
      },
      profile: {
        title: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
        updateProfile: 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಿ',
        recommendationsHistory: 'ಶಿಫಾರಸುಗಳ ಇತಿಹಾಸ',
      },
      ui: {
        searchPlaceholder: 'ಸಸ್ಯವನ್ನು ಇಲ್ಲಿ ಹುಡುಕಿ...'
      },
      labels: {
        soil: 'ಮಣ್ಣು',
        season: 'ಋತು'
      },
      widgets: {
        weatherToday: 'ಇಂದಿನ ಹವಾಮಾನ',
        plantGrowth: 'ಸಸ್ಯಗಳ ಬೆಳವಣಿಗೆ ಕ್ರಿಯಾಶೀಲತೆ',
        location: 'ಸ್ಥಳ'
      },
      charts: {
        summaryProduction: 'ಉತ್ಪಾದನಾ ಸಾರಾಂಶ'
      },
      tile: {
        verticalHarvestTitle: 'ವೆರ್ಟಿಕಲ್ ಹಾರ್ವೆಸ್ಟ್ ಫಾರ್ಮ್ಸ್',
        verticalHarvestDesc: 'ಗ್ರೀನ್ಹೌಸ್ ಅಥವಾ ನಗರ ಕೃಷಿಯಲ್ಲಿ ಲಂಬ ಸ್ಥಳವನ್ನು ಬಳಸಿ ಬೆಳೆಗಳನ್ನು ಪರಿಣಾಮಕಾರಿಯಾಗಿ ರಚಿಸಿ.'
      },
      buttons: {
        reenterDetails: 'ವಿವರಗಳನ್ನು ಮರು ನಮೂದಿಸಿ'
      },
      rec: {
        title: 'ಬೆಳೆ ಶಿಫಾರಸು',
        bestEnvironmentalMatch: 'ಅತ್ಯುತ್ತಮ ಪರಿಸರ ಹೊಂದಾಣಿಕೆ',
        mostSuitable: 'ಅತಿ ಸೂಕ್ತ ಬೆಳೆ',
        mostProfitable: 'ಅತಿ ಲಾಭದಾಯಕ ಬೆಳೆ',
        scoringWeights: 'ಸ್ಕೋರಿಂಗ್ ತೂಕಗಳು',
        price: 'ಬೆಲೆ',
        suitability: 'ಸೂಕ್ತತೆ',
        combined: 'ಸಂಯುಕ್ತ',
        filters: {
          ranking: 'ರ್ಯಾಂಕಿಂಗ್',
          profitability: 'ಲಾಭಾಂಶ',
          suitability: 'ಸೂಕ್ತತೆ'
        },
        scoreDistribution: 'ಸ್ಕೋರ್ ವಿತರಣಾ',
        envMatchScore: 'ಪರಿಸರ ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್',
        combinedScore: 'ಸಂಯುಕ್ತ ಸ್ಕೋರ್',
        notePerQuintal: 'ಸೂಚನೆ: ಎಲ್ಲಾ ಬೆಲೆಗಳು ಪ್ರತಿಕ್ವಿಂಟಲ್ (100 ಕೆಜಿ) ಗೆ ತೋರಿಸಲಾಗುತ್ತವೆ.'
      },
      common: {
        noData: 'ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ'
      },
      debug: {
        totalCropsEvaluated: 'ಒಟ್ಟು ಮೌಲ್ಯಮಾಪನೆಗೊಳಿಸಿದ ಬೆಳೆಗಳು:',
        cropsWithPrices: 'ಬೆಲೆ ಡೇಟಾ ಇರುವ ಬೆಳೆಗಳು:',
        cropsWithoutPrices: 'ಬೆಲೆ ಡೇಟಾ ಇಲ್ಲದ ಬೆಳೆಗಳು:'
      }
    },
  },
  bn: {
    translation: {
      nav: {
        home: 'হোম',
        about: 'আমাদের সম্পর্কে',
        howItWorks: 'কিভাবে কাজ করে',
        contact: 'যোগাযোগ',
        dashboard: 'ড্যাশবোর্ড',
        profile: 'প্রোফাইল',
        login: 'লগইন',
        logout: 'লগআউট',
      },
      hero: {
        title: 'স্মার্ট ক্রপ অ্যাডভাইসরি সিস্টেম',
        subtitle: 'আপনার অবস্থান, মাটির ধরন এবং বাজারমূল্যের ভিত্তিতে এআই চালিত ফসলের সুপারিশ পান। সচেতন সিদ্ধান্ত নিন এবং লাভ বাড়ান।',
        getStarted: 'শুরু করুন',
        learnMore: 'আরও জানুন',
      },
      about: {
        title: 'আমাদের প্ল্যাটফর্ম সম্পর্কে',
        description: 'আমরা মেশিন লার্নিং এবং রিয়েল-টাইম বাজারের ডেটা ব্যবহার করে কৃষকদের সিদ্ধান্ত নিতে সাহায্য করি।',
      },
      howItWorks: {
        title: 'কিভাবে কাজ করে',
        step1: 'আপনার খামারের বিবরণ দিন',
        step2: 'এআই সুপারিশ পান',
        step3: 'লাভজনক ফসল ফলান',
      },
      auth: {
        login: 'লগইন',
        register: 'রেজিস্টার',
        email: 'ইমেইল',
        password: 'পাসওয়ার্ড',
        fullName: 'পূর্ণ নাম',
        signIn: 'সাইন ইন',
        signUp: 'সাইন আপ',
        noAccount: 'অ্যাকাউন্ট নেই?',
        haveAccount: 'আগেই অ্যাকাউন্ট আছে?',
      },
      dashboard: {
        title: 'ফসল পরামর্শ ড্যাশবোর্ড',
        subtitle: 'ব্যক্তিগত সুপারিশ পেতে আপনার খামারের বিবরণ দিন',
        prompt: 'ব্যক্তিগত ড্যাশবোর্ড দেখতে ফর্ম জমা দিন।'
      },
      common: {
        unavailable: 'উপলভ্য নয়',
        na: 'এন/এ'
      },
      form: {
        state: 'রাজ্য',
        district: 'জেলা',
        market: 'বাজারের নাম',
        landType: 'মাটির ধরন',
        landSize: 'জমির আকার (একর)',
        season: 'মৌসুম',
        submit: 'সুপারিশ দেখুন',
        analyzing: 'বিশ্লেষণ চলছে...',
      },
      ui: {
        searchPlaceholder: 'গাছের নাম খুঁজুন...'
      },
      labels: {
        soil: 'মাটি',
        season: 'মৌসুম'
      },
      widgets: {
        weatherToday: 'আজকের আবহাওয়া',
        plantGrowth: 'গাছের বৃদ্ধি',
        location: 'অবস্থান'
      },
      charts: {
        summaryProduction: 'উৎপাদনের সারসংক্ষেপ'
      },
      tile: {
        verticalHarvestTitle: 'ভার্টিক্যাল হারভেস্ট ফার্মস',
        verticalHarvestDesc: 'গ্রিনহাউস বা শহুরে খামারে উল্লম্ব জায়গা ব্যবহার করে ফসল সাজান।'
      },
      buttons: {
        reenterDetails: 'বিস্তারিত পুনরায় দিন'
      },
      rec: {
        title: 'ফসলের সুপারিশ',
        bestEnvironmentalMatch: 'সেরা পরিবেশগত মিল',
        mostSuitable: 'সর্বাধিক উপযুক্ত ফসল',
        mostProfitable: 'সর্বাধিক লাভজনক ফসল',
        scoringWeights: 'স্কোরিং ওজন',
        price: 'মূল্য',
        suitability: 'উপযুক্ততা',
        combined: 'সম্মিলিত',
        filters: {
          ranking: 'র্যাঙ্কিং',
          profitability: 'লাভ',
          suitability: 'উপযুক্ততা'
        },
        scoreDistribution: 'স্কোর বণ্টন',
        envMatchScore: 'পরিবেশগত মিল স্কোর',
        combinedScore: 'সম্মিলিত স্কোর',
        notePerQuintal: 'নোট: সব মূল্য প্রতি কুইন্টাল (১০০ কেজি) হিসেবে প্রদর্শিত।'
      },
      common: {
        noData: 'ডেটা নেই'
      },
      debug: {
        totalCropsEvaluated: 'মোট মূল্যায়িত ফসল:',
        cropsWithPrices: 'মূল্য সহ ফসল:',
        cropsWithoutPrices: 'মূল্য ছাড়া ফসল:'
      }
    }
  },
  ta: {
    translation: {
      nav: {
        home: 'முகப்பு',
        about: 'எங்களை பற்றி',
        howItWorks: 'இது எவ்வாறு செயல்படுகிறது',
        contact: 'தொடர்பு',
        dashboard: 'டாஷ்போர்டு',
        profile: 'சுயவிவரம்',
        login: 'உள்நுழைவு',
        logout: 'வெளியேறு',
      },
      hero: {
        title: 'ஸ்மார்ட் பயிர் ஆலோசனை அமைப்பு',
        subtitle: 'உங்கள் இடம், மண் வகை மற்றும் சந்தை விலைகளின் அடிப்படையில் AI-இயங்கும் பயிர் பரிந்துரைகளைப் பெறுங்கள். அதிக லாபத்திற்கு தகவலறிந்த முடிவுகளை எடுங்கள்.',
        getStarted: 'தொடங்குங்கள்',
        learnMore: 'மேலும் அறிக',
      },
      about: {
        title: 'எங்கள் தளத்தைப் பற்றி',
        description: 'இயந்திர கற்றல் மற்றும் நேரடி சந்தை தரவுகளைப் பயன்படுத்தி விவசாயிகளுக்கு தரவு சார்ந்த முடிவுகளை எடுக்க உதவுகிறோம்.',
      },
      howItWorks: {
        title: 'இது எப்படி வேலை செய்கிறது',
        step1: 'உங்கள் பண்ணை விவரங்களை உள்ளிடுங்கள்',
        step2: 'AI பரிந்துரைகளைப் பெறுங்கள்',
        step3: 'லாபகரமான பயிர்களை வளர்க்கவும்',
      },
      auth: {
        login: 'உள்நுழைவு',
        register: 'பதிவு செய்யவும்',
        email: 'மின்னஞ்சல்',
        password: 'கடவுச்சொல்',
        fullName: 'முழு பெயர்',
        signIn: 'உள்நுழைய',
        signUp: 'பதிவு செய்க',
        noAccount: 'கணக்கு இல்லையா?',
        haveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
      },
      dashboard: {
        title: 'பயிர் ஆலோசனை டாஷ்போர்டு',
        subtitle: 'தனிப்பயனாக்கப்பட்ட பரிந்துரைகளைப் பெற உங்கள் பண்ணை விவரங்களை உள்ளிடவும்',
        prompt: 'தனிப்பயனாக்கப்பட்ட டாஷ்போர்டைக் காண படிவத்தை சமர்ப்பிக்கவும்.'
      },
      common: {
        unavailable: 'கிடைக்கவில்லை',
        na: 'N/A',
        noData: 'தரவு கிடைக்கவில்லை'
      },
      form: {
        state: 'மாநிலம்',
        district: 'மாவட்டம்',
        market: 'சந்தையின் பெயர்',
        landType: 'மண் வகை',
        landSize: 'நில அளவு (ஏக்கர்)',
        season: 'பருவம்',
        submit: 'பரிந்துரைகளைப் பெறுங்கள்',
        analyzing: 'பகுப்பாய்வு செய்கிறது...',
      },
      profile: {
        title: 'எனது சுயவிவரம்',
        updateProfile: 'சுயவிவரத்தைப் புதுப்பிக்கவும்',
        recommendationsHistory: 'பரிந்துரைகளின் வரலாறு',
      },
      ui: {
        searchPlaceholder: 'இங்கே தாவரத்தைத் தேடவும்...'
      },
      labels: {
        soil: 'மண்',
        season: 'பருவம்'
      },
      widgets: {
        weatherToday: 'இன்றைய வானிலை',
        plantGrowth: 'செடி வளர்ச்சி நடவடிக்கை',
        location: 'இடம்'
      },
      charts: {
        summaryProduction: 'உற்பத்தி சுருக்கம்'
      },
      tile: {
        verticalHarvestTitle: 'செங்குத்து அறுவடை பண்ணைகள்',
        verticalHarvestDesc: 'பசுமை இல்லங்கள் அல்லது நகர்ப்புற பண்ணைகளில் செங்குத்து இடத்தைப் பயன்படுத்தி பயிர்களை திறமையாக அடுக்கவும்.'
      },
      buttons: {
        reenterDetails: 'விவரங்களை மீண்டும் உள்ளிடவும்'
      },
      rec: {
        title: 'பயிர் பரிந்துரை',
        bestEnvironmentalMatch: 'சிறந்த சுற்றுச்சூழல் பொருத்தம்',
        mostSuitable: 'மிகவும் ஏற்ற பயிர்',
        mostProfitable: 'மிகவும் இலாபகரமான பயிர்',
        scoringWeights: 'மதிப்பெண் எடைகள்',
        price: 'விலை',
        suitability: 'பொருத்தம்',
        combined: 'ஒருங்கிணைந்த',
        filters: {
          ranking: 'தரவரிசை',
          profitability: 'லாபம்',
          suitability: 'பொருத்தம்'
        },
        scoreDistribution: 'மதிப்பெண் விநியோகம்',
        envMatchScore: 'சுற்றுச்சூழல் பொருத்த மதிப்பெண்',
        combinedScore: 'ஒருங்கிணைந்த மதிப்பெண்',
        notePerQuintal: 'குறிப்பு: அனைத்து விலைகளும் குவிண்டால் (100 கிலோ) ஒன்றுக்குக் காட்டப்படுகின்றன.'
      },
      debug: {
        totalCropsEvaluated: 'மொத்த மதிப்பீடு செய்யப்பட்ட பயிர்கள்:',
        cropsWithPrices: 'விலை தரவுடன் பயிர்கள்:',
        cropsWithoutPrices: 'விலை தரவு இல்லாத பயிர்கள்:'
      }
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
