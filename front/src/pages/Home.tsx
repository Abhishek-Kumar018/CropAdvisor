import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Brain, TrendingUp, Droplets, LineChart, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // Wait a tick to ensure layout is ready, then smooth scroll
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen home-bg">
      <Navigation />

      {/* Hero Section */}
<section className="relative py-20 px-4 bg-gradient-to-br from-primary/50 via-[#0f766e]/50 to-[#065f46]/50 overflow-hidden text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="glass rounded-full p-4">
              <Sprout className="h-16 w-16 text-white" />
            </div>
          </div>
          
<div className="rounded-3xl p-6 md:p-8 inline-block mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-75 bg-gradient-to-br from-white/60 via-[#a7f3d0]/40 to-[#6ee7b7]/40 dark:from-white/10 dark:via-[#0f766e]/50 dark:to-[#065f46]/55 backdrop-blur-xl border border-white/50 dark:border-white/20 shadow-[var(--shadow-soft)]">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-6 drop-shadow-lg">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
<Button asChild size="lg" variant="glass" className="text-lg h-14 px-8 bg-white/90 hover:bg-white text-emerald-900 border-white shadow-lg font-semibold">
                <Link to="/auth">
                  {t('hero.getStarted')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
<Button asChild size="lg" variant="outline" className="text-lg h-14 px-8 bg-transparent hover:bg-white/30 text-white border-white/80 hover:border-white shadow-xl font-semibold">
                <Link to="#how-it-works">{t('hero.learnMore')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Why Choose CropAdvisor?</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Advanced AI technology combined with real-time data to maximize your agricultural success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow glass">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md">AI-Powered Analysis</h3>
              <p className="text-white/90 drop-shadow-sm">
                Machine learning models analyze soil composition, weather patterns, and historical data for accurate predictions.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow glass">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md">Real Market Prices</h3>
              <p className="text-white/90 drop-shadow-sm">
                Stay updated with current market prices across different states and districts for informed decision-making.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow glass">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Droplets className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md">Detailed Crop Guides</h3>
              <p className="text-white/90 drop-shadow-sm">
                Get comprehensive information on watering schedules, fertilizer requirements, and pest management.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">{t('about.title')}</h2>
              <p className="text-lg text-white/90 mb-6 drop-shadow-sm">
                {t('about.description')}
              </p>
              <p className="text-lg text-white/90 mb-6 drop-shadow-sm">
                Our platform combines cutting-edge machine learning algorithms with comprehensive agricultural databases 
                to provide farmers with actionable insights. We analyze multiple factors including soil composition, 
                local weather patterns, historical crop performance, and current market trends.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <span className="font-semibold">10,000+ Farmers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-semibold">95% Accuracy</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-emerald-600/20" />
              <img 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80" 
                alt="Modern farming"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">{t('howItWorks.title')}</h2>
            <p className="text-xl text-white/90 drop-shadow-md">Simple, fast, and effective</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center glass p-6 rounded-xl">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md">{t('howItWorks.step1')}</h3>
              <p className="text-white/90 drop-shadow-sm">
                Input your location, soil type, land size, and market information
              </p>
            </div>

            <div className="text-center glass p-6 rounded-xl">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md">{t('howItWorks.step2')}</h3>
              <p className="text-white/90 drop-shadow-sm">
                Our AI analyzes data and provides crop recommendations with profitability insights
              </p>
            </div>

            <div className="text-center glass p-6 rounded-xl">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md">{t('howItWorks.step3')}</h3>
              <p className="text-white/90 drop-shadow-sm">
                Follow our detailed growing guides and maximize your harvest yields
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">Get in Touch</h2>
          <p className="text-xl text-white/90 mb-8 drop-shadow-md">
            Have questions? We're here to help you succeed in your farming journey.
          </p>
          <Card className="p-8 glass">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold mb-2 text-white drop-shadow-md">Email</h3>
                <p className="text-white/90 drop-shadow-sm">support@cropadvisor.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white drop-shadow-md">Phone</h3>
                <p className="text-white/90 drop-shadow-sm">+91 1800-XXX-XXXX</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white drop-shadow-md">Office Hours</h3>
                <p className="text-white/90 drop-shadow-sm">Monday - Saturday: 9AM - 6PM</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white drop-shadow-md">Location</h3>
                <p className="text-white/90 drop-shadow-sm">Agricultural Technology Hub, India</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
