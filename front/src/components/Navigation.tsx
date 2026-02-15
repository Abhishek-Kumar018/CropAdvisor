import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sprout, LogOut, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Navigation() {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onDashboard = location.pathname.startsWith('/dashboard');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Sprout className="h-6 w-6 text-primary" />
          <span>CropAdvisor</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/#about" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.about')}
          </Link>
          <Link to="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.howItWorks')}
          </Link>
          <Link to="/#contact" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.contact')}
          </Link>

          {user && (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.dashboard')}
              </Link>
              <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.profile')}
              </Link>
            </>
          )}

          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-[120px] text-black dark:text-black bg-white/80 backdrop-blur-sm">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-black">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
              <SelectItem value="bn">বাংলা</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
            </SelectContent>
          </Select>

{user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className={`${onDashboard ? 'text-white hover:text-white border-white/40 hover:bg-white/10' : 'text-black hover:text-primary'}`}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('nav.logout')}
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">{t('nav.login')}</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
