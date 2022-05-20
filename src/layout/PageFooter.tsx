// Core
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Styles
import './PageFooter.scss';

// Component
const PageFooter: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="PageFooter">
      <span className="credits">©{new Date().getFullYear()} Hunger Free Oklahoma</span>
      <Link to={t('footer.nondiscriminationLink') as string}>
        {t('footer.nondiscriminationStatement')}
      </Link>
    </div>
  );
};

// Export
export default PageFooter;
